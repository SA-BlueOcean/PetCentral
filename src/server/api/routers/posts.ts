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
      }))
    .mutation(async ({ ctx, input }) => {
      const groupIdValue = input.groupId !== '' ? input.groupId : undefined;
      const newPostId = await ctx.db.post.create({
        data: {
          content: input.content,
          groupId: groupIdValue,
          createdById: ctx.session.user.id,
        },
      });

      return {
        postId: newPostId?.id,
      };
  }),

    addPhoto: protectedProcedure
    .input(
      z.object({
        postId: z.number(),
        photoUrl: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      console.log('hi');
        return await ctx.db.photo.create({
          data: {
            url: input.photoUrl,
            post: {
              connect: { id: input.postId },
            },
          }
        });
    }),
  });