import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  findFriends: publicProcedure
    .input(z.object({ distance: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        select: {
          id: true,
          name: true,
          profilePhotoUrl: true,
          bio: true,
          pets: true,
          location: true,
        },
      });

      return users;
    }),
});
