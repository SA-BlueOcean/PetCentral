import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const chatRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const chats = await ctx.db.chats.findMany({
      where: {
        users: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
    });
    return chats;
  }),
  joinChat: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const chatUsers = await ctx.db.chatUsers.findFirst({
        where: {
          AND: [
            { chats: { users: { some: { userId: input.userId } } } },
            { chats: { users: { some: { userId: ctx.session.user.id } } } },
          ],
        },
      });
      if (chatUsers) {
        return { id: chatUsers.chatsId };
      }
      const create = await ctx.db.chats.create({
        data: {
          users: {
            createMany: {
              data: [input.userId, ctx.session.user.id].map((uid) => ({
                userId: uid,
              })),
            },
          },
        },
      });
      return create;
    }),
});
