import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user in database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          return null;
        }

        // For beta users, check if password is 'password'
        if (credentials.password === 'password') {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN";
      }
      
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      
      // If user exists in database, fetch their role
      if (token.sub) {
        const dbUser = await prisma.user.findUnique({
          where: {
            id: token.sub,
          },
          select: {
            role: true,
          },
        });
        
        if (dbUser) {
          token.role = dbUser.role;
        }
      }
      
      return token;
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
