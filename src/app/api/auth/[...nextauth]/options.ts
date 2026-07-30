import type { NextAuthOptions, Session as NextAuthSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Adapter } from "next-auth/adapters";

// Extend session with user role
interface ExtendedSession extends NextAuthSession {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    gender?: string | null;
    role?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,

  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("No credentials provided");

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("User not found");
        if (!user.password) throw new Error("Please sign in with your OAuth provider");

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) throw new Error("Invalid credentials");

        return {
          id: user.id,
          email: user.email,
          image: user.image,
          name: user.name,
          gender: user.gender,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      // On initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.image = user.image;

        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          select: { role: true, gender: true },
        });

        if (dbUser) {
          token.role = dbUser.role ?? "user";
          token.gender = dbUser.gender;
        }
      }

      return token;
    },

    async session({ session, token }): Promise<ExtendedSession> {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as string,
          email: token.email as string,
          image: token.image as string,
          gender: token.gender as string,
        },
      };
    },
  },
};
