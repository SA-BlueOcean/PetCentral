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

  fetchGroupMembers: publicProcedure
  .input(
    z
    .object({
      groupId: z.string()
    })
  )
  .query(async ({ ctx, input }) => {
    const userCount = await ctx.db.group.findMany({
      include: {
        _count: {
          select: { members: true },
        },
      },
    });
    return {
      members: userCount,
    };
  })
});