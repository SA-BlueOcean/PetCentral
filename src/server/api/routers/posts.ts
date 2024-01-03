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
      await ctx.db.post.create({
        data: {
          content: input.content,
          groupId: groupIdValue,
          createdById: ctx.session.user.id,
        },
      });
    }),
  });