import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "./routers/example";
import { feedRouter } from "./routers/feed";
import { groupRouter } from "./routers/groups";
import { userRouter } from "./routers/users";
import { postRouter } from "./routers/posts";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  feed: feedRouter,
  groups: groupRouter,
  users: userRouter,
  posts: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
