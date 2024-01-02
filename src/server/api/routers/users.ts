import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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

  fetchUser: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
        }
      })
    })
});