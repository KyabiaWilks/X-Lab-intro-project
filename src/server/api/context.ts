import { verify } from "jsonwebtoken";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { db } from "../db";
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';
dotenv.config();

interface CreateContextOptions {
    token: string,
}
// 定义 JWT 用户类型
interface JWTUserType {
    uid?: string;
    name?: string;
    isAdmin?: boolean;
}

export function createContextInner(_opts: CreateContextOptions): JWTUserType {
    if (!_opts.token) {
        console.error("ERR1")
        return {}
    }
    try{
        const user = verify(_opts.token, process.env.JWT_SECRET_KEY!) as JWTUserType;
        if (user.uid !== undefined) {
            console.error("user.uid !== undefined")
            return user
        }
        else {
            console.error("ERR2")
            return {};
        }
    } catch (e) {
        console.log(e)
        console.error("Error in verifying token")
        return {}
    }
}

export async function createTrpcContext(
    cookies: ReadonlyRequestCookies | RequestCookies,
    setCookie: (name: string, value: string) => void,
) {
    const token = cookies.get('token')?.value ?? '';  
    console.log("token:", token)
    return {
        ...createContextInner({ token: cookies.get('token')?.value ?? '' }),
        db,
        setCookie,
    };
}

export type Context = Awaited<ReturnType<typeof createTrpcContext>>;