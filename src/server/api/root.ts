import { createTRPCRouter } from "@/server/api/trpc";
import { exampleRouter } from "./routers/example";
import { feedRouter } from "./routers/feed";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  feed: feedRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
