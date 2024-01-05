import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

// create tRPC router
export const groupRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
        photoUrl: z.string(),
        bannerPhotoUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.group.create({
        data: {
          name: input.name,
          description: input.description,
          photoUrl: input.photoUrl,
          bannerPhotoUrl: input.bannerPhotoUrl,
          members: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  fetchDetails: publicProcedure
    .input(
      z.object({
        groupID: z.string().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const details = await ctx.db.group.findFirst({
        where: {
          id: input.groupID,
        },
      });
      return {
        group: details,
      };
    }),

  fetchGroups: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    const groups = await ctx.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        groups: true,
      },
    });

    return {
      groups: groups?.groups ?? [],
    };
  }),

  fetchMemberCount: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userCount = await ctx.db.group.findUnique({
        where: {
          id: input.groupId,
        },
        include: {
          _count: {
            select: { members: true },
          },
        },
      });

      const memberCount = userCount?._count?.members ?? 0;

      return {
        memberCount: memberCount,
      };
    }),
  fetchIsMember: protectedProcedure
    .input(z.object({ groupId: z.string() }))
    .query(async ({ input, ctx }) => {
      const isMember = await ctx.db.user.findFirst({
        where: {
          id: ctx.session.user.id,
          groups: {
            some: {
              id: input.groupId,
            },
          },
        },
        select: {
          id: true,
        },
      });
      return !!isMember?.id;
    }),
  fetchMembers: publicProcedure
    .input(
      z.object({
        groupId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const groupUsers = await ctx.db.group.findUnique({
        where: {
          id: input.groupId,
        },
        select: {
          members: {
            select: {
              id: true,
            },
          },
        },
      });

      return {
        usersIds: groupUsers?.members,
      };
    }),
  findAllGroups: publicProcedure.query(async ({ ctx }) => {
    const allGroups = await ctx.db.group.findMany();
    return {
      groups: allGroups,
    };
  }),
  searchGroups: publicProcedure
  .input(
    z
    .object({
      searchTerm: z.string().optional(),
    })
  )
  .query(async ({ ctx, input }) => {
    const searchGroups = await ctx.db.group.findMany({
      where: {
        name: {
          contains: input.searchTerm,
          mode: "insensitive",
        },
      },
    });

    return {
      groups: searchGroups,
    };
  }),

});
