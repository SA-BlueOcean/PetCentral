import { z } from "zod";
import zipcodes from "zipcodes";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  findFriends: publicProcedure
    .input(z.object({ distance: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      let zips = zipcodes.radius(30301, input?.distance);
      const users = await ctx.db.user.findMany({
        where: {
          location: {
            zipCode: {
              in: zips,
            },
          },
        },
        select: {
          id: true,
          name: true,
          profilePhotoUrl: true,
          bio: true,
          pets: {
            select: {
              id: true,
              firstName: true,
              breedId: true,
            },
          },
          location: {
            select: {
              zipCode: true,
              locationName: true,
            },
          },
        },
      });

      return users;
    }),
});
