import type { Response } from "./vite-env";
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '~/server/api/root';

export const trpc = createTRPCReact<AppRouter>();

// const prefix = "https://chatroom.zjuxlab.com/api";
const prefix = "http://localhost:3000";

export async function getFetcher(key:string) {
    const resp = (await fetch(prefix + key, { mode: "cors" }).then((res) => res.json()))as Response<any>;

    if(resp.code !== 0) {
        throw new Error(resp.message + " " + resp.code);
    }
    return resp.data;
}

export async function postFetcher(
    key:string,
    body: { arg:Record<string, unknown> | Array<unknown> }
) {
    const resp = (await fetch(prefix + key, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body.arg),
        mode: "cors",
    }).then((res) => res.json())) as Response<any>;

    if(resp.code !== 0) {
        throw new Error(resp.message + " " + resp.code);
    }
    return resp.data;
}

type ErrorResponse = {
    meta?: {
      response?: {
        error?: {
          json?: {
            message?: string;
          };
        };
      };
    };
  };
  
  export function getErrorMessage(error: unknown): string {
    let errorMessage = 'Unknown error occurred';
  
    if (error && typeof error === 'object') {
      // 尝试从错误对象中提取错误消息
      const errorObject = error as ErrorResponse;
  
      if (errorObject.meta?.response?.error?.json?.message) {
        errorMessage = errorObject.meta.response.error.json.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }
    }
  
    return errorMessage;
  }