import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { messages, rooms } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";
import { boolean } from "drizzle-orm/mysql-core";

// 定义API返回格式的类型
type Response = {
  msg: string;
  code: number;
  data: any;
};

// 创建tRPC路由器
export const roomMessageRouter = createTRPCRouter({
    // 获取房间中的消息
    list: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ ctx, input }) => {
      const messageList = await ctx.db.query.messages.findMany({
        where: (messages, { eq }) => eq(messages.roomId, input.roomId),
        orderBy: (messages, { asc }) => [asc(messages.time)],
      });
  
      return {
        msg: "Success",
        code: 200,
        data: messageList,
      } as Response;
      }),
  });

export const roomRouter = createTRPCRouter({
    // 获取所有房间信息
    list: protectedProcedure.query(async ({ ctx }) => {
        // 获取房间列表，并按最后一条消息的ID排序
        const roomList = await ctx.db.query.rooms.findMany({
          orderBy: (rooms, { desc }) => [desc(rooms.lastMessageId)],
        });
    
        // 获取所有房间的最后一条消息
        const roomsWithLastMessage = await Promise.all(
          roomList.map(async (room) => {
            let lastMessage = null;
            
            if (room.lastMessageId !== null) {
              // 只有在 lastMessageId 非 null 的情况下才进行查询
              lastMessage = await ctx.db.query.messages.findFirst({
                where: (messages, { eq }) => eq(messages.messageId, room.lastMessageId as number),
              });
            }
    
            return {
              ...room,
              lastMessage: lastMessage ?? null, // 如果找不到消息，返回 null
            };
          })
        );
    
        return {
          msg: "Success",
          code: 200,
          data: roomsWithLastMessage,
        } as Response;
      }),
  
  // 创建新房间
  add: protectedProcedure
    .input(z.object({ roomName: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const newRoom = await ctx.db.insert(rooms).values({
        roomName: input.roomName,
      });

      return {
        msg: "Success",
        code: 201,
        data: newRoom,
      } as Response;
    }),

  // 删除房间
  delete: protectedProcedure
  .input(z.object({ roomId: z.number() }))
  .mutation(async ({ ctx, input }) => {
    await ctx.db.delete(rooms).where(eq(rooms.roomId, input.roomId));

    return {
      msg: "Success",
      code: 200,
      data: null,
    } as Response;
  }),
  message: roomMessageRouter // 将房间消息路由器挂载到 roomRouter 下
});


export const messageRouter = createTRPCRouter({
  // 添加新消息
  add: protectedProcedure
  .input(
    z.object({
      roomId: z.number(),
      sender: z.string().min(1),
      content: z.string().min(1),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const newMessage = await ctx.db.insert(messages).values({
      roomId: input.roomId,
      sender: input.sender,
      content: input.content,
      time: new Date(),
    }).returning();

    if (newMessage.length === 0) {
        throw new Error("Failed to insert new message.");
    }
  
    await ctx.db.update(rooms).set({
        lastMessageId: newMessage[0]?.messageId,
    }).where(eq(rooms.roomId, input.roomId));
  
    return {
      msg: "Success",
      code: 201,
      data: newMessage,
    } as Response;
    }),
});
