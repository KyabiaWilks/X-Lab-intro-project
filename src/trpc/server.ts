import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { cookies } from 'next/headers'; // 用于获取 cookies
import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTrpcContext } from "~/server/api/context";

// 创建上下文
const createContext = async (req: NextRequest) => {
  const reqCookies = cookies(); // 获取当前请求的 cookies
  const setCookie = (name: string, value: string) => {
    // 这里可以实现设置 cookie 的逻辑，比如通过响应头
    req.headers.append('Set-Cookie', `${name}=${value}; Path=/`);
  };

  return createTrpcContext(reqCookies, setCookie);
};

// 处理请求
const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req), // 这里调用正确的 createContext 方法
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
