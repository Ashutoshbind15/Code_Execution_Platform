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
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();

      let appUser = await User.findOne({ email: user.email });
      if (!appUser) {
        appUser = await User.create({ ...user, role: "user" }); // Assign default role
        user.id = appUser._id;
      }
      // Optionally, add custom logic here if you want to assign roles differently
      return true;
    },
    async session({ session, user }) {
      session.user.role = user.role; // Append role to user session
      session.user.id = user.id; // Append user id to user session
      return session;
    },
  },
};
