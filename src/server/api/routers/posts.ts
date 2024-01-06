import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        groupId: z.string().optional(),
        photoUrl: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.post.create({
        data: {
          content: input.content,
          groupId: input.groupId ? input.groupId : null,
          createdById: ctx.session.user.id,
          photos: input.photoUrl
            ? {
                create: {
                  url: input.photoUrl,
                },
              }
            : undefined,
        },
      });
    }),

  addPhoto: protectedProcedure
    .input(
      z.object({
        photoUrl: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const photo = await ctx.db.photo.create({
        data: {
          url: input.photoUrl,
        },
      });

      return {
        photoId: photo?.id,
      };
    }),
});
