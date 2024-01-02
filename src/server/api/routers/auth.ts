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

      let data = zipcode.lookup(+input.zipCode);
      if (!data) data = zipcode.lookup(37660);
      const zipCode = data?.zip;
      const locationName = data?.city + ", " + data?.state;
      const latitude = data?.latitude ?? 0;
      const longitude = data?.longitude ?? 0;

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
