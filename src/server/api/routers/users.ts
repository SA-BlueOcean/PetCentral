import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  updateUserGroups: protectedProcedure
  .input(
    z
    .object({
      groupId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        groups: {
          connect: { id: input.groupId, },
        }
      }
    })
  }),

  removeUserGroup: protectedProcedure
  .input(
    z
    .object({
      groupId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    await ctx.db.user.update({
      where: { id: ctx.session.user.id },
      data: {
        groups: {
          disconnect: { id: input.groupId, },
        }
      }
    })
  }),

  fetchUser: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        }
      })
      return {
        user: user,
      };
    })
});