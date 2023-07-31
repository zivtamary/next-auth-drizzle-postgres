import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { adapterDB, db } from "~/drizzle";
import "dotenv/config";
import { DrizzleAdapter } from "~/drizzle/adapter";
import * as AuthSchema from "~/drizzle/schema/auth";
import {
  pGetSessionAndUser,
  pGetSessionByToken,
  pGetUserByAccount,
  pGetUserByEmail,
  pGetUserById,
  pGetVerificationTokenByToken,
} from "~/drizzle/prepared";

const NEXTAUTH_SECRET = process.env["NEXTAUTH_SECRET"];
const GOOGLE_CLIENT_ID = process.env["GOOGLE_CLIENT_ID"];
const GOOGLE_CLIENT_SECRET = process.env["GOOGLE_CLIENT_SECRET"];
if (!NEXTAUTH_SECRET)
  throw new Error("NEXTAUTH_SECRET is missing from env variables");
if (!GOOGLE_CLIENT_ID)
  throw new Error("GOOGLE_CLIENT_ID is missing from env variables");
if (!GOOGLE_CLIENT_SECRET)
  throw new Error("GOOGLE_CLIENT_SECRET is missing from env variables");

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(adapterDB, {
    schemas: {
      account: AuthSchema.account,
      session: AuthSchema.session,
      user: AuthSchema.user,
      verificationToken: AuthSchema.verificationToken,
    },
    prepared: {
      getUserByEmail: pGetUserByEmail,
      getUserById: pGetUserById,
      getUserByAccount: pGetUserByAccount,
      getSessionByToken: pGetSessionByToken,
      getSessionAndUser: pGetSessionAndUser,
      getVerificationTokenByToken: pGetVerificationTokenByToken,
    },
  }),
  secret: NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token?.name || 'asasd';
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },

    jwt: async ({ token, user }) => {
      const dbUser = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.email, token.email),
      });

      if (!dbUser) {
        if (user) {
          token.id = user.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name || "",
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
