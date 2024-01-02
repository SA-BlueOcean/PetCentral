import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import zipcode from 'zipcodes';

export const authRouter = createTRPCRouter({
  editUser: protectedProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        zipCode: z.string().length(5),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: ctx.session?.user.id },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });

      const data = zipcode.lookup(+input.zipCode);
      const zipCode = data.zip;
      const locationName = data.city + ", " + data.state;
      const latitude = data.latitude;
      const longitude = data.longitude;

      await ctx.db.location.upsert({
        where: { userId: ctx.session?.user.id },
        create: {
          userId: ctx.session?.user.id,
          zipCode,
          locationName,
          latitude,
          longitude,
        },
        update: {
          zipCode,
          locationName,
          latitude,
          longitude,
        },
      });
    }),
});
