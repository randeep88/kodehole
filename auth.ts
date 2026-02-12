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
            // ✅ Custom error throw karo
            throw new UserNotFoundError();
          }

          const isMatch = await bcrypt.compare(
            password as string,
            user.password as string,
          );

          if (!isMatch) {
            // ✅ Custom error throw karo
            throw new InvalidPasswordError();
          }

          return {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            usernameSet: user.usernameSet ?? true,
          };
        } catch (error) {
          // ✅ Agar custom error hai toh re-throw karo
          if (error instanceof CredentialsSignin) {
            throw error;
          }

          // ✅ Database errors ke liye generic error
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
    async signIn({ user, account, profile }) {
      try {
        // Sirf OAuth providers ke liye
        if (account?.provider === "google" || account?.provider === "github") {
          await connectDB();

          console.log("Checking user:", user.email); // Debug log

          let existingUser = await User.findOne({
            email: user.email,
          });

          if (!existingUser) {
            // Naya user create karo
            const newUser = await User.create({
              email: user.email,
              name: user.name,
              provider: account.provider,
              usernameSet: false,
              image: user.image,
            });

            // User object update karo
            user.id = newUser._id.toString();
            // @ts-ignore
            user.username = newUser.username;
            // @ts-ignore
            user.usernameSet = false;
          } else {
            // Existing user ka data set karo
            user.id = existingUser._id.toString();
            // @ts-ignore
            user.username = existingUser.username;
            // @ts-ignore
            user.usernameSet = existingUser.usernameSet ?? true;
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

    async jwt({ token, user }) {
      await connectDB();
      const dbUser = await User.findOne({ email: token.email });

      if (!dbUser) {
        return null;
      }

      if (user) {
        token.id = user.id;
        // @ts-ignore
        token.username = user.username;
        // @ts-ignore
        token.usernameSet = user.usernameSet ?? true;
      } else {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.usernameSet = dbUser.usernameSet ?? true;
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
      }

      return session;
    },
  },
});
