import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession {
        accessToken?: string;
        username?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        accessToken?: string;
        username?: string;
    }
}
