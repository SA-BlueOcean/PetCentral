import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";


// create tRPC router
export const groupRouter = createTRPCRouter({
  fetchDetails: publicProcedure
  .input(
    z
    .object({
      groupID: z.string()
    })
  )
  .query(
    async ({ input, ctx }) => {
    const details = await ctx.db.group.findFirst({
      where: {
        id: input.groupID
      },
    })
    return {
      group: details,
    };
  }),

  getGroupPosts: publicProcedure
  .input(
    z
      .object({
        groupId: z.string(),
        cursor: z.number().optional(),
      })
      .optional(),
  )
  .query(async ({ input, ctx }) => {
    const feed = await ctx.db.post.findMany({
      where: {
        groupId: input?.groupId,
      },
      include: {
        createdBy: true,
        group: true,
        photos: true,
        comments: true,
      },
      orderBy: {
        upvotes: "desc",
      },
    });

    return {
      posts: feed,
    };
  }),
});


//   create: protectedProcedure
//     .input(z.object({ name: z.string().min(1) }))
//     .mutation(async ({ ctx, input }) => {
//       // simulate a slow db call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       return ctx.db.post.create({
//         data: {
//           name: input.name,
//           createdBy: { connect: { id: ctx.session.user.id } },
//         },
//       });
//     }),

//   getLatest: protectedProcedure.query(({ ctx }) => {
//     return ctx.db.post.findFirst({
//       orderBy: { createdAt: "desc" },
//       where: { createdBy: { id: ctx.session.user.id } },
//     });
//   }),

//   getSecretMessage: protectedProcedure.query(() => {
//     return "you can now see this secret message!";
//   }),

