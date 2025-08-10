"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCaller = exports.appRouter = void 0;
var post_1 = require("~/server/api/routers/post");
var user_1 = require("~/server/api/routers/user");
var chatroom_1 = require("~/server/api/routers/chatroom");
var trpc_1 = require("~/server/api/trpc");
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
exports.appRouter = (0, trpc_1.createTRPCRouter)({
    post: post_1.postRouter,
    user: user_1.userRouter,
    room: chatroom_1.roomRouter,
    message: chatroom_1.messageRouter,
    roomMessage: chatroom_1.roomMessageRouter
});
/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
exports.createCaller = (0, trpc_1.createCallerFactory)(exports.appRouter);
