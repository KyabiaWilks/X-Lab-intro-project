import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTrpcContext } from "~/server/api/context";
import { verify } from "jsonwebtoken";
import { NextResponse } from 'next/server';
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */

// 定义 JWT 用户类型
interface JWTUserType {
  uid?: string;
  name?: string;
  isAdmin?: boolean;
}

// 在服务器端可能需要设置 Cookie
const createContext = async(req: NextRequest, setCookie: (name: string, value: string) => void) => {
  return createTrpcContext(req.cookies, setCookie);
}

const handler = (req: NextRequest) =>
{
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req, (name: string, value: string) => {
      console.log("CCsetCookie:", name, value);
      cookies().set(name, value, {
        maxAge: 60 * 60 * 24 * 7,
      });
    }),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });
}
export { handler as GET, handler as POST };
