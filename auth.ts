import NextAuth, { CredentialsSignin } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import User from "./src/models/User";
import bcrypt from "bcrypt";
import connectDB from "./src/lib/db";

// ✅ Custom error classes banao
class InvalidLoginError extends CredentialsSignin {
  code = "Invalid identifier or password";
}

class UserNotFoundError extends CredentialsSignin {
  code = "User not found";
}

class InvalidPasswordError extends CredentialsSignin {
  code = "Invalid password";
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;

        if (!username || !password) {
          throw new InvalidLoginError();
        }

        try {
          await connectDB();

          const user = await User.findOne({
            username: username as string,
          });

          if (!user) {
            throw new UserNotFoundError();
          }

          const isMatch = await bcrypt.compare(
            password as string,
            user.password as string,
          );

          if (!isMatch) {
            throw new InvalidPasswordError();
          }

          return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            usernameSet: user.usernameSet ?? true,
          };
        } catch (error) {
          if (error instanceof CredentialsSignin) {
            throw error;
          }
          console.error("Database error:", error);
          throw new InvalidLoginError();
        }
      },
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),

    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.AUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google" || account?.provider === "github") {
          await connectDB();

          let existingUser = await User.findOne({
            email: user.email,
          });

          if (!existingUser) {
            const newUser = await User.create({
              email: user.email,
              name: user.name,
              provider: account.provider,
              usernameSet: false,
              image: user.image,
            });

            user.id = newUser._id.toString();
            // @ts-ignore
            user.username = newUser.username;
            // @ts-ignore
            user.usernameSet = false;
            // @ts-ignore
            user.isNewUser = true;
          } else {
            user.id = existingUser._id.toString();
            // @ts-ignore
            user.username = existingUser.username;
            // @ts-ignore
            user.usernameSet = existingUser.usernameSet ?? true;
            // @ts-ignore
            user.isNewUser = !existingUser.usernameSet;
          }
        }

        return true;
      } catch (error) {
        console.error("SignIn callback error:", error);

        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        return true;
      }
    },

    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.username = user.username;
        // @ts-ignore
        token.usernameSet = user.usernameSet ?? true;
        // @ts-ignore
        token.isNewUser = user.isNewUser ?? false;
      } else if (trigger === "update") {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.usernameSet = dbUser.usernameSet ?? true;
          token.isNewUser = false;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user.id = token.id;
        // @ts-ignore
        session.user.username = token.username;
        // @ts-ignore
        session.user.usernameSet = token.usernameSet;
        // @ts-ignore
        session.user.isNewUser = token.isNewUser ?? false;
      }

      return session;
    },
  },
});
