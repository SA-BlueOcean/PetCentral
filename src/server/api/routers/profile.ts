import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import zipcode from "zipcodes";
import { z } from "zod";

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
          pets: {
            include: {
              breed: {
                include: {
                  animal: true,
                },
              },
            },
          },
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
      if (input.firstName !== "") {
        await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            firstName: input.firstName,
          },
        });
      }
      if (input.lastName !== "") {
        await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            lastName: input.lastName,
          },
        });
      }
      if (input.about !== "") {
        await ctx.db.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            bio: input.about,
          },
        });
      }
      if (input.zip === undefined || input.zip === "") {
        return;
      }
      const data = zipcode.lookup(+input.zip ?? 37660);
      const zipCode = data?.zip;
      const locationName = data?.city + ", " + data?.state;
      const latitude = data?.latitude ?? 0;
      const longitude = data?.longitude ?? 0;
      await ctx.db.location.upsert({
        where: { userId: ctx.session?.user.id },
        create: {
          userId: ctx.session?.user.id,
          zipCode,
          locationName,
          latitude,
          longitude,
        },
        update: {
          zipCode,
          locationName,
          latitude,
          longitude,
        },
      });
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
