import { connectDB } from "@/lib/db";
import User from "@/models/User";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      let appUser = await User.findOne({ email: user.email });
      if (!appUser) {
        appUser = await User.create({
          username: user.name,
          email: user.email,
          role: "user",
        }); // Assign default role
      }
      user.id = appUser._id.toString();
      user.role = appUser.role;

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id.toString(); // Convert MongoDB ObjectId to string for the JWT
        token.role = user.role; // Add user role to JWT
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.uid; // Assign database ID to session
      session.user.role = token.role; // Include role in session
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
