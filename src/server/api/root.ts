import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "./routers/example";
import { feedRouter } from "./routers/feed";
import { profileRouter } from "./routers/profile";
import { authRouter } from "./routers/auth";
import { commentRouter } from "./routers/comments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  feed: feedRouter,
  profile: profileRouter,
  auth: authRouter,
  comments: commentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "./routers/example";
import { feedRouter } from "./routers/feed";
import { profileRouter } from "./routers/profile";
import { authRouter } from "./routers/auth";
import { groupRouter } from "./routers/groups";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  feed: feedRouter,
  profile: profileRouter,
  auth: authRouter,
  groups: groupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
