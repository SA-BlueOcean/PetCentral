import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";


// create tRPC router
export const groupRouter = createTRPCRouter({
  fetchDetails: publicProcedure
  .input(
    z
    .object({
      groupID: z.string()
    })
  )
  .query(
    async ({ input, ctx }) => {
    const details = await ctx.db.group.findFirst({
      where: {
        id: input.groupID
      },
    })
    return {
      group: details,
    };
  }),

  fetchGroups: publicProcedure.query(async ({ ctx }) => {
    const groups = await ctx.db.group.findMany({});

    return {
      groups: groups,
    };
  }),

  fetchMemberCount: publicProcedure
  .input(
    z
    .object({
      groupId: z.string()
    })
  )
  .query(async ({ ctx, input }) => {
    const userCount = await ctx.db.group.findUnique({
      where: {
        id: input.groupId
      },
      include: {
        _count: {
          select: { members: true },
        },
      },
    });

    const memberCount = userCount?._count?.members ?? 0;

    return {
      memberCount: memberCount,
    };
  }),

  fetchMembers: publicProcedure
  .input(
    z
    .object({
      groupId: z.string()
    })
  )
  .query(async ({ ctx, input }) => {
    const groupUsers = await ctx.db.group.findUnique({
      where: {
        id: input.groupId,
      },
      include: {
        members: true,
      },
    });

    return {
      users: groupUsers?.members ?? [],
    };
  }),
});