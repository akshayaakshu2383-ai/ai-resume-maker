import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { supabaseAdmin } from "@/lib/supabase";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account.provider === "google") {
        try {
          const { error } = await supabaseAdmin
            .from("profiles")
            .upsert({
              id: user.id,
              email: user.email,
              // role is handled by default or manually in DB
            }, { onConflict: 'id' });
          
          if (error) console.error("Error syncing profile:", error);
        } catch (err) {
          console.error("Profile sync exception:", err);
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        // Fetch the actual UUID and role from profiles using the email as the source of truth
        const { data: profile, error } = await supabaseAdmin
          .from("profiles")
          .select("id, role")
          .eq("email", session.user.email)
          .single();
        
        if (profile) {
          session.user.id = profile.id;
          (session.user as any).role = profile.role;
        } else {
          // Fallback if profile wasn't created yet for some reason
          session.user.id = token.sub;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
