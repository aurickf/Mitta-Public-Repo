import { CustomSession, CustomUser } from "@/interface/Session";
import { UserModel } from "@/models/index";
import clientPromise from "@/utils/connectDB";
import { normalizeIdentifier, sendVerificationRequest } from "@/utils/mailer";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import crypto from "crypto";
import { DateTime } from "luxon";
import NextAuth, { SessionStrategy } from "next-auth";
import { JWT } from "next-auth/jwt";
import EmailProvider from "next-auth/providers/email";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";

const generateUsername = (profile) => {
  const nameArray = profile.name.split(" ");
  const firstName = nameArray[0].toLowerCase();
  const randomId = crypto.randomBytes(3).toString("hex");

  return `${firstName}${randomId}`;
};

export const authOptions = {
  session: {
    strategy: "database" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, //30 days
    updateAge: 24 * 60 * 60, //1 day
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      httpOptions: {
        timeout: 60000,
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: "",
          username: generateUsername(profile),
        };
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      httpOptions: {
        timeout: 60000,
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: "",
          username: generateUsername(profile),
        };
      },
    }),
    // Passwordless / email sign in
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        //@ts-ignore
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
      sendVerificationRequest: (params) => sendVerificationRequest(params),
      normalizeIdentifier: (identifier) => normalizeIdentifier(identifier),
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    verifyRequest: "/auth/verify-request", // (used for check email message)
  },
  callbacks: {
    async signIn(params) {
      const { user } = params;

      if (user?.access?.ban?.isBanned) return "/auth/banned";

      try {
        const _user = await UserModel.findById(user.id);
        _user.access.lastLoggedIn = new Date();
        await _user.save();
      } catch (error) {
        return error;
      }

      return true;
    },
    async session(params) {
      let {
        session,
        user,
      }: {
        session: CustomSession;
        token: JWT;
        user: CustomUser;
      } = params;

      const url = process.env.AWS_AVATAR;
      session = {
        ...session,
        user: {
          ...session.user,
          _id: user.id,
          username: user.username,
          image: user?.image ? url + user.image : "",
          phone: user.phone,
          role: user.role,
          access: user.access,
          membership: user.membership,
        },
      };

      if (
        DateTime.now().toJSDate() <
        DateTime.fromISO(process.env.NEXT_PUBLIC_MITTA_LICENSE)
          .endOf("day")
          .toJSDate()
      )
        return session;

      return null;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  adapter: MongoDBAdapter(clientPromise),
};

export default NextAuth(authOptions);
