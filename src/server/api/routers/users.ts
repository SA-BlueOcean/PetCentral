import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  // create: protectedProcedure
  // .input(
  //   z
  //   .object
  //   ({
  //     content: z.string().min(1),
  //     groupId: z.string().optional()
  //   }))
  // .mutation(async ({ ctx, input }) => {
  //   // simulate a slow db call
  //   await new Promise((resolve) => setTimeout(resolve, 1000));

  //   return ctx.db.post.create({
  //     data: {
  //       content: input.content,
  //       group: input.groupId ? { connect: { id: input.groupId }} : undefined,
  //       createdBy: { connect: { id: ctx.session.user.id } },
  //     },
  //   });
  // }),
});