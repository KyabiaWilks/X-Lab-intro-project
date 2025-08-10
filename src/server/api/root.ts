import { postRouter } from "~/server/api/routers/post";
import { userRouter } from "~/server/api/routers/user";
import { messageRouter, roomMessageRouter, roomRouter } from "~/server/api/routers/chatroom";

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { messages } from "../db/schema";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  room: roomRouter,
  message: messageRouter,
  roomMessage: roomMessageRouter
});

const printRoutes = (router: any, path: string = '') => {
  router._def?.procedures.forEach((proc: any) => {
    console.log(`${path}${proc._def.path}`);
  });

  Object.keys(router._def?.routers || {}).forEach((key) => {
    printRoutes(router._def.routers[key], `${path}${key}.`);
  });
};

printRoutes(appRouter.room);

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
