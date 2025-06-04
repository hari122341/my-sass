import { createClient } from "@supabase/supabase-js"
import { auth } from "@clerk/nextjs/server";
export const createSupabaseClient = () => {
    console.log(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            async accessToken() {
                const token = await auth();
                console.log("Token: ", token);
                return await token.getToken();
            }
        })

}