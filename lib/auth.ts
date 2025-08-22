import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        userType: { label: "User Type", type: "text" },
      },
      async authorize(credentials: any) {
        console.log("=== DEBUG AUTHORIZE ===");
        console.log("Credentials received:", credentials);

        if (
          !credentials?.email ||
          !credentials?.password ||
          !credentials?.userType
        ) {
          console.log("Credenciais incompletas");
          return null;
        }

        try {
          const user = await db.query.users.findFirst({
            where: and(
              eq(users.email, credentials.email),
              eq(users.role, credentials.userType as "customer" | "merchant")
            ),
          });

          console.log("User found:", user);
          console.log(
            "🔧 [AUTH] Hash armazenado:",
            user?.password_hash?.substring(0, 20) + "..."
          );
          console.log("🔧 [AUTH] Senha fornecida:", credentials.password);

          if (!user || !user.password_hash) {
            console.log("Usuário não encontrado ou sem senha");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );

          console.log("🔧 [AUTH] Comparação bcrypt:", {
            senhaFornecida: credentials.password,
            hashArmazenado: user.password_hash.substring(0, 20) + "...",
            resultado: isPasswordValid,
          });

          if (!isPasswordValid) {
            console.log("Senha inválida");
            return null;
          }

          const userToReturn = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            role: user.role,
            cpf: user.cpf || undefined,
          };

          console.log("User to return:", userToReturn);
          return userToReturn;
        } catch (error) {
          console.error("Erro no authorize:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      console.log("=== DEBUG SIGNIN ===");
      console.log("User:", user);
      console.log("Account:", account);
      console.log("Profile:", profile);

      if (account?.provider === "google" && profile) {
        const existingUser = await db.query.users.findFirst({
          where: (users, { eq, or }) =>
            or(
              eq(users.email, user.email!),
              eq(users.oauth_provider_id, profile.sub)
            ),
        });

        if (!existingUser) {
          await db.insert(users).values({
            email: user.email!,
            name: user.name,
            avatar_url: user.image,
            oauth_provider: "google",
            oauth_provider_id: profile.sub,
            role: "customer",
            password_hash: null,
          });
        } else if (existingUser.oauth_provider !== "google") {
          await db
            .update(users)
            .set({
              oauth_provider: "google",
              oauth_provider_id: profile.sub,
              avatar_url: user.image,
              updated_at: new Date(),
            })
            .where(eq(users.id, existingUser.id));
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      console.log("=== DEBUG SESSION ===");
      console.log("Session:", session);
      console.log("Token:", token);

      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.cpf = token.cpf;
        console.log("Session atualizada:", session);
      }
      return session;
    },
    async jwt({ token, user }: any) {
      console.log("=== DEBUG JWT ===");
      console.log("Token:", token);
      console.log("User:", user);

      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.cpf = user.cpf;
        console.log("Token atualizado:", token);
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/cadastro",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
