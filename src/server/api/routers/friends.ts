import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import zipcodes from "zipcodes";
import { z } from "zod";

export const friendsRouter = createTRPCRouter({
  findFriends: protectedProcedure
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
          OR: [
            {
              AND: [
                {
                  id: {
                    not: ctx.session.user.id,
                  },
                },
                {
                  friendsB: {
                    none: {
                      friendAId: ctx.session.user.id,
                    },
                  },
                },
                {
                  location: {
                    zipCode: {
                      in: zips,
                    },
                  },
                },
              ],
            },

            {
              friendsA: {
                some: {
                  friendBId: ctx.session.user.id,
                  status: {
                    not: "ACCEPTED",
                  },
                },
              },
              // other condition
            },
          ],
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
  getFriends: protectedProcedure.query(async ({ ctx }) => {
    const friends = await ctx.db.friend.findMany({
      where: {
        friendAId: ctx.session.user.id,
        status: "ACCEPTED",
      },
      select: {
        friendB: true,
      },
    });
    return {
      friends: friends,
    };
  }),
  getStatus: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const f = await ctx.db.friend.findFirst({
        where: {
          friendAId: ctx.session.user.id,
          friendBId: input.userId,
        },
      });
      return f?.status;
    }),
  addFriend: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.session.user.id) {
        throw new Error("Can't add self as friend!");
      }

      const hasRequest = await ctx.db.friend.findFirst({
        where: {
          friendAId: input.userId,
          friendBId: ctx.session.user.id,
        },
      });
      if (
        hasRequest?.status === "ACCEPTED" ||
        hasRequest?.status === "PENDING"
      ) {
        await ctx.db.$transaction([
          ctx.db.friend.update({
            where: {
              friendAId_friendBId: {
                friendAId: input.userId,
                friendBId: ctx.session.user.id,
              },
            },
            data: {
              status: "ACCEPTED",
            },
          }),
          ctx.db.friend.upsert({
            where: {
              friendAId_friendBId: {
                friendAId: ctx.session.user.id,
                friendBId: input.userId,
              },
            },
            create: {
              friendAId: ctx.session.user.id,
              friendBId: input.userId,
              status: "ACCEPTED",
            },
            update: {
              status: "ACCEPTED",
            },
          }),
        ]);
        return "ACCEPTED";
      } else {
        await ctx.db.friend.upsert({
          where: {
            friendAId_friendBId: {
              friendAId: ctx.session.user.id,
              friendBId: input.userId,
            },
          },
          create: {
            friendAId: ctx.session.user.id,
            friendBId: input.userId,
            status: "PENDING",
          },
          update: {
            status: "PENDING",
          },
        });
        return "PENDING";
      }
    }),
});
