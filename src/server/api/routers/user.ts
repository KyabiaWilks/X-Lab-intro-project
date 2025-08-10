import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from 'dotenv';

type JWTUserType = {
  uid: string;
  name: string;
  isAdmin?: boolean;
};

const insertUserSchema = z.object({
  name: z.string(),
  password: z.string(),
});

const updateUserSchema = insertUserSchema.extend({
  id: z.number(),
});

export const userRouter = createTRPCRouter({
  login: publicProcedure
    .input(z.object({ name: z.string().min(1), password: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.name, input.name),
      });
      if (!user) {
        throw new Error("User not found");
      }
      if (!user.name) {
        throw new Error("Please enter a username");
      }
      if (!user.password) {
        throw new Error("Please enter a password");
      }
      const u: JWTUserType = {
        uid: user.id.toString(),
        name: user.name!,
        isAdmin: user.isAdmin || false,
      };
      // console.log("JWT_SECRET_KEY:", process.env.JWT_SECRET_KEY);

      const token = jwt.sign(u, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
      
      if (user && user.password && await bcrypt.compare(input.password, user.password)) {
        console.error("setCookie_token:", token);
        ctx.setCookie('token', token);
        return { success: true };
      } else {
        throw new Error("Invalid username or password");
      }
    }),

    create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      password: z.string().min(6), // 确保密码长度至少为6个字符
    }))
    .mutation(async ({ ctx, input }) => {
      // 检查用户名是否已存在
      const existingUser = await ctx.db.query.users.findFirst({
        where: (users, { eq }) => eq(users.name, input.name),
      });

      if (existingUser) {
        throw new Error("Username already exists");
      }

      // 对密码进行加密
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // 插入用户信息到数据库
      const [newUser] = await ctx.db
        .insert(users)
        .values({
          name: input.name,
          password: hashedPassword,
          isAdmin: false,
        })
      .returning({ id: users.id });
      if (!newUser) {
        throw new Error("Failed to create user");
      }
      const u: JWTUserType = {
        uid: newUser!.id.toString(),
        name: input.name!,
        isAdmin: false,
      };
      const token = jwt.sign(u, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' });
      ctx.setCookie('token', token);
    }),

    update: protectedProcedure
    .input(updateUserSchema)
      .mutation(async ({ ctx, input }) => {
        await ctx.db
          .update(users)
          .set({
            name: input.name,
            password: input.password,
        })
        .where(eq(users.id, input.id));
    }),

    delete: protectedProcedure
      .input(z.number()).mutation(async ({ ctx, input }) => {
        await ctx.db.delete(users).where(eq(users.id, input));
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.isAdmin) {
        return ctx.db.query.users.findMany();
      }
      return [];
    }),

    current: publicProcedure.query(async ({ ctx }) => {
      return {
        uid: ctx.uid,
        username: ctx.name,
        isAdmin: ctx.isAdmin,
      };
    }),

    logout: publicProcedure.mutation(async ({ ctx }) => {
      // 删除 cookie
      ctx.setCookie('token', '');
      return { success: true };
    }),
});