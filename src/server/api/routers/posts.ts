import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
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
      console.log(input);
      await ctx.db.post.create({
        data: {
          content: input.content,
          groupId: input.groupId ?? undefined,
          createdById: ctx.session.user.id,
        },
      });
    }),
  });