import { createTRPCRouter } from "@/server/api/trpc";
import { chatRouter } from "./routers/chat";
import { commentRouter } from "./routers/comments";
import { exampleRouter } from "./routers/example";
import { feedRouter } from "./routers/feed";
import { friendsRouter } from "./routers/friends";
import { groupRouter } from "./routers/groups";
import { petsRouter } from "./routers/pets";
import { postRouter } from "./routers/posts";
import { profileRouter } from "./routers/profile";
import { userRouter } from "./routers/users";

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
  comments: commentRouter,
  chat: chatRouter,
  pets: petsRouter,
  friends: friendsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
