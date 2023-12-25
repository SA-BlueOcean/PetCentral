import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const feedRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z
        .object({
          groupId: z.string().optional(),
          profileId: z.string().optional(),
          cursor: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const postsPerPage = 5;
      const feed = await ctx.db.post.findMany({
        where: {
          groupId: input?.groupId,
          createdById: input?.profileId,
        },
        cursor: input?.cursor ? { id: input.cursor } : undefined,
        take: postsPerPage + 1,
      });

      let nextCursor = null as null | number;
      if (feed.length > postsPerPage) {
        const last = feed.pop();
        nextCursor = last?.id ?? null;
      }

      return {
        posts: feed,
        nextCursor,
      };
    }),
});
