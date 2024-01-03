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
          location: true,
          pets: true,
        },
      });
      return profile;
    }),
  updateInfo: protectedProcedure
    .input(
      z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        about: z.string().optional(),
        zip: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // new stuff
      if (input.firstName !== undefined) {
        return await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            firstName: input.firstName,
          },
        });
      }
      if (input.lastName !== undefined) {
        return await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            lastName: input.lastName,
          },
        });
      }
      if (input.about !== undefined) {
        return await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            bio: input.about,
          },
        });
      }
    }),
  // at the moment the mutation is working updating both, one to empty if both fields are not filled in
  updatePhotos: protectedProcedure
    .input(
      z.object({
        profilePhotoUrl: z.string().optional(),
        bannerPhotoUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // new stuff
      if (input.profilePhotoUrl !== undefined) {
        return await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            profilePhotoUrl: input.profilePhotoUrl,
          },
        });
      }
      if (input.bannerPhotoUrl !== undefined) {
        return await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            bannerPhotoUrl: input.bannerPhotoUrl,
          },
        });
      }
    }),
});
