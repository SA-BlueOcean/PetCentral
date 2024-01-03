/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const feedRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z
        .object({
          groupId: z.string().optional(),
          profileId: z.string().optional(),
          cursor: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      const postsPerPage = 5;
      const feed = await ctx.db.post.findMany({
        where: {
          groupId: input?.groupId,
          createdById: input?.profileId,
        },
        include: {
          createdBy: true,
          group: true,
          photos: true,
          votes: ctx.session?.user.id
            ? {
                where: {
                  userId: ctx.session?.user.id,
                },
              }
            : undefined,
        },
        orderBy: {
          createdAt: "desc",
        },
        cursor: input?.cursor ? { id: input.cursor } : undefined,
        take: postsPerPage + 1,
      });

      let nextCursor = null as null | number;
      if (feed.length > postsPerPage) {
        const last = feed.pop();
        nextCursor = last?.id ?? null;
      }

      return {
        posts: feed,
        nextCursor,
      };
    }),
  vote: protectedProcedure
    .input(z.object({ postId: z.number(), vote: z.number().gte(-1).lte(1) }))
    .mutation(async ({ input, ctx }) => {
      const update = await ctx.db.$transaction(async (tx) => {
        const prev = await tx.votes.findUnique({
          where: {
            userId_postId: {
              userId: ctx.session.user.id,
              postId: input.postId,
            },
          },
          select: {
            id: true,
            postId: true,
            vote: true,
          },
        });
        const vote = await tx.votes.upsert({
          where: {
            userId_postId: {
              userId: ctx.session.user.id,
              postId: input.postId,
            },
          },
          create: {
            postId: input.postId,
            userId: ctx.session.user.id,
            vote: input.vote,
          },
          update: {
            vote: input.vote,
          },
        });
        const post = await tx.post.update({
          where: {
            id: input.postId,
          },
          data: {
            upvotes:
              input.vote === 1 && prev?.vote !== 1
                ? {
                    increment: 1,
                  }
                : prev?.vote === 1 && input.vote !== 1
                  ? {
                      decrement: 1,
                    }
                  : undefined,
            downvotes:
              input.vote === -1 && prev?.vote !== -1
                ? {
                    increment: 1,
                  }
                : prev?.vote === -1 && input.vote !== -1
                  ? {
                      decrement: 1,
                    }
                  : undefined,
          },
        });
        return {vote, post};
      });
      return update;
    }),
});
