import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const friendsRouter = createTRPCRouter({
  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  findFriends: protectedProcedure
    .input(z.object({ distance: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({});

      return users;
    }),
});
