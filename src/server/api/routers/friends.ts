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
      const userZip = await ctx.db.user.findUnique({
        where: {
          id: ctx.session?.user.id,
        },
        select: {
          location: {
            select: {
              zipCode: true,
            },
          },
        },
      });

      let zips = zipcodes.radius(userZip?.location?.zipCode, input?.distance);
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
              breed: {
                select: {
                  animalId: true,
                },
              },
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
