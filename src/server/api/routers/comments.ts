import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const commentRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const postsPerPage = 5;
      const comments = await ctx.db.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              firstName: true,
              lastName: true,
              profilePhotoUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: input?.cursor ? { id: input.cursor } : undefined,
        take: postsPerPage + 1,
      });

      let nextCursor = null as null | number;
      if (comments.length > postsPerPage) {
        const last = comments.pop();
        nextCursor = last?.id ?? null;
      }

      return {
        comments,
        nextCursor,
      };
    }),
  create: protectedProcedure
    .input(z.object({ postId: z.number(), content: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.$transaction([
        ctx.db.comment.create({
          data: {
            createdById: ctx.session.user.id,
            postId: input.postId,
            content: input.content,
          },
        }),
        ctx.db.post.update({
          where: {
            id: input.postId,
          },
          data: {
            numComments: {
              increment: 1,
            },
          },
        }),
      ]);
    }),
});
