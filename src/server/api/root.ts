import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "./routers/example";
import { feedRouter } from "./routers/feed";
import { profileRouter } from "./routers/profile";
import { authRouter } from "./routers/auth";
import { commentRouter } from "./routers/comments";
import { friendsRouter } from "./routers/friends";
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
  users: userRouter,
  posts: postRouter,
  groups: groupRouter,
  profile: profileRouter,
  auth: authRouter,
  comments: commentRouter,
  friends: friendsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
