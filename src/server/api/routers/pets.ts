import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { z } from "zod";

export const petsRouter = createTRPCRouter({
  getAnimals: publicProcedure.query(async ({ ctx }) => {
    const animals = await ctx.db.animal.findMany({
      include: {
        breeds: true,
      },
    });
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
  addPet: protectedProcedure
    .input(
      z.object({
        breedId: z.number(),
        firstName: z.string(),
        lastName: z.string().optional(),
        photoUrl: z.string().optional(),
        dateOfBirth: z.date(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pet = await ctx.db.pet.create({
        data: {
          breedId: input.breedId,
          firstName: input.firstName,
          lastName: input.lastName,
          photoUrl: input.photoUrl,
          dateOfBirth: input.dateOfBirth,
          ownerId: ctx.session.user.id,
        },
      });
      return pet;
    }),
  updatePet: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
        breedId: z.number().optional(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        photoUrl: z.string().optional(),
        dateOfBirth: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updateData: any = {
        breedId: input.breedId,
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: input.dateOfBirth,
      };

      if (input.photoUrl && input.photoUrl.trim() !== "") {
        updateData.photoUrl = input.photoUrl;
      }

      const pet = await ctx.db.pet.update({
        where: {
          id: input.petId,
        },
        data: updateData,
      });
      return pet;
    }),
  removePet: protectedProcedure
    .input(
      z.object({
        petId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const pet = await ctx.db.pet.delete({
        where: {
          id: input.petId,
        },
      });
      return pet;
    }),
});
