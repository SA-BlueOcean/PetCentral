import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure
    .input(
      z
      .object({
        content: z.string().min(1),
        groupId: z.string().optional(),
        photoId: z.string(),
      }))
    .mutation(async ({ ctx, input }) => {
      const groupIdValue = input.groupId !== '' ? input.groupId : undefined;
       return await ctx.db.post.create({
        data: {
          content: input.content,
          groupId: groupIdValue,
          createdById: ctx.session.user.id,
          photos: {
            connect: { id: input.photoId },
          },
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
          }
        });

        return {
          photoId: photo?.id,
        }
    }),
  });