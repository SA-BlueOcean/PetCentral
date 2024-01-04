import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const chatRouter = createTRPCRouter({
   getAll: protectedProcedure.query(async({ ctx }) => {
    const chats = await ctx.db.chats.findMany({
      where: {
        users: {
          some: {
            userId: ctx.session.user.id
          }
        }
      }
    })
    return chats;
  }),
});
