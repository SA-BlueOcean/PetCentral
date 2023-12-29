import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const profileRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z
        .object({
          profileId: z.string(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const profile = await ctx.db.user.findUnique({
        where: {
          id: input?.profileId,
        },
        include: {
          // user: true,
          posts: {
            include: {
              createdBy: true,
              group: true,
              photos: true,
              comments: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          groups: true,
          friendsA: {
            where: {
              status: "ACCEPTED",
            },
          },
          friendsB: {
            where: {
              status: "ACCEPTED",
            },
          },
          pets: true,
        },
      });
      return profile;
    }),
});
