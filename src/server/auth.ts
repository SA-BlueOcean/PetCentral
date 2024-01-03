import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import * as nextAuth from "next-auth";
import { type Session, type User } from "next-auth";
import type JWT from "next-auth/jwt";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import { env } from "@/env";
import { db } from "@/server/db";

declare module "next-auth" {
  interface Session extends nextAuth.DefaultSession {
    user: nextAuth.DefaultSession["user"] & {
      id: string;
    };
  }
}

const getCookies = () => {
  const useSecureCookies = true;
  const cookiePrefix = useSecureCookies ? "__Secure-" : "";

  return {
    callbackUrl: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "none" as const,
        path: "/",
        secure: useSecureCookies,
      },
    },
  };
};

export const authOptions: nextAuth.NextAuthOptions = {
  callbacks: {
    session: async ({
      session,
      token,
    }: {
      session: Session;
      token: JWT.JWT;
    }) => {
      if (token?.id && session.user) {
        session.user.id = token.id as string;
      }
      return Promise.resolve(session);
    },
    jwt: ({ token, user }: { token: JWT.JWT; user?: User }) => {
      if (user) {
        token.id = user.id;
      }
      return Promise.resolve(token);
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: { strategy: "jwt" },
  jwt: {
    secret: env.NEXTAUTH_SECRET,
  },
  secret: env.NEXTAUTH_SECRET,
  cookies: getCookies(),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    newUser: "/auth/onboarding",
  },
};

export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return nextAuth.getServerSession(ctx.req, ctx.res, authOptions);
};
