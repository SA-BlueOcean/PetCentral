import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const feedRouter = createTRPCRouter({
  get: publicProcedure
    .input(
      z
        .object({
          mode: z
            .enum(["SUBS", "FRIENDS", "PROFILE", "GROUP", "ALL"])
            .optional(),
          groupId: z.string().optional(),
          profileId: z.string().optional(),
          cursor: z.number().optional(),
          searchTerm: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ input, ctx }) => {
      if (
        (input?.mode === "SUBS" || input?.mode === "FRIENDS") &&
        !ctx.session?.user.id
      ) {
        return {
          posts: [],
          nextCursor: null,
        };
      }
      const postsPerPage = 5;
      const feed = await ctx.db.post.findMany({
        where: {
          groupId: input?.groupId,
          createdById: input?.profileId,
          group:
            input?.mode === "SUBS"
              ? {
                  members: {
                    some: {
                      id: ctx.session?.user.id,
                    },
                  },
                }
              : undefined,
          createdBy:
            input?.mode === "FRIENDS"
              ? {
                  friendsB: {
                    some: {
                      friendAId: ctx.session?.user.id,
                      status: "ACCEPTED"
                    },
                  },
                }
              : undefined,
          content: {
            contains: input?.searchTerm,
            mode: "insensitive",
          },
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
        props: input,
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
        return { vote, post };
      });
      return update;
    }),
});
