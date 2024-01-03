import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";

export const petsRouter = createTRPCRouter({
  getAnimals: publicProcedure.query(async ({ ctx }) => {
    const animals = await ctx.db.animal.findMany({});
    return {
      animals: animals,
    };
  }),
  getBreeds: publicProcedure
    .input(z.object({ animalId: z.number() }))
    .query(async ({ input, ctx }) => {
      const breeds = await ctx.db.breed.findMany({
        where: {
          animalId: input?.animalId,
        },
      });
      return {
        breeds: breeds,
      };
    }),
  // input animal id find many with animal id

  // create: protectedProcedure
  //   .input(
  //     z.object({ content: z.string().min(1), groupId: z.string().optional() }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     // simulate a slow db call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     return ctx.db.post.create({
  //       data: {
  //         content: input.content,
  //         group: input.groupId ? { connect: { id: input.groupId } } : undefined,
  //         createdBy: { connect: { id: ctx.session.user.id } },
  //       },
  //     });
  //   }),

  // getLatest: protectedProcedure.query(({ ctx }) => {
  //   return ctx.db.post.findFirst({
  //     orderBy: { createdAt: "desc" },
  //     where: { createdBy: { id: ctx.session.user.id } },
  //   });
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});

// ctrl space
