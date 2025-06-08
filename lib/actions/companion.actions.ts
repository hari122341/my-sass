'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '../supabase';
// import {CreateCompanion} from '@/types'

// interface CreateCompanion {
//     name: string;
//     subject: string;
//     topic: string;
//     style: string;
//     voice: string;
//     duration: number;
// }

export const createCompanion = async (formData: CreateCompanion) => {
    const { userId: author } = await auth();
    const supabase = createSupabaseClient();

    const { data, error } = await supabase.
        from('Companions').
        insert({ ...formData, author })
        .select();
    console.log(data);

    if (error || !data) throw new Error(error?.message || 'Failed to create a companion');

    return data[0];


}

export const getAllCompanions = async ({ limit = 10, page = 1, subject, topic }: GetAllCompanions) => {

    const supabase = createSupabaseClient();
    let query = supabase.from('Companions').select();

    if (subject && topic) {
        query = query.ilike('subject', `%${subject}%`)
            .or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    } else if (subject) {
        query = query.ilike('subject', `%${subject}%`)
    } else if (topic) {
        query = query.or(`topic.ilike.%${topic}%,name.ilike.%${topic}%`)
    }

    query = query.range((page - 1) * limit, page * limit - 1);

    const { data: companions, error } = await query;

    if (error) throw new Error(error.message);

    return companions;

}
export const getCompanion = async (id: string) => {
    const supabase = createSupabaseClient();
    // console.log("database lo id:", id);

    const { data, error } = await supabase
        .from('Companions')
        .select()
        .eq('id', id);

    if (error) return console.log(error);

    return data[0];
}

export const addToSessionHistory = async (companionId: string) => {
    const { userId } = await auth();
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history').insert({
        companion_id: companionId,
        user_id: userId
    })
    // if (error) throw new Error(error.message);
    console.log("Session history added:", data);
    if (error) {
        console.error("Error adding to session history:", error);

    }
    return data;
}

export const getRecentSessions = async (limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .select(`companions:companion_id(*)`)
        .order('created_at', {
            ascending: false
        })
        .limit(limit);
    if (error) throw new Error(error.message);
    console.log("Recent sessions data:", data);
    // console.log("hari: ", data.map(({ companion }) => { return companion }));
    return data.map(({ companions }) => { return companions });
}
export const getUserSession = async (userId: string, limit = 10) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('session_history')
        .select(`companions:companion_id(*)`)
        .eq('user_id', userId)
        .order('created_at', {
            ascending: false
        })
        .limit(limit);
    if (error) throw new Error(error.message);
    // console.log("User session data:as", data);
    return data.map(
        ({ companions }) => {
            return companions;
        }
    )
}
export const getUserCompanions = async (userId: string) => {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase.from('Companions')
        .select()
        .eq('author', userId);

    // console.log("User ascompanions data:", data);
    if (error) {
        console.log("Error fetching user companions:", error);
    }
    // console.log(data);
    // return data.map(({ companions }) => companions)
    return data;
}

export const newCompanionPermissions = async () => {
    const { userId, has } = await auth();
    const supabase = createSupabaseClient();
    let limit = 0;

    if (has({
        plan: 'pro'
    })) {
        return true;
    } else if (has({ feature: "3_companion_limit" })) {
        limit = 3;
    } else if (has({ feature: "10_companion_limit" })) {
        limit = 10;

    }
    const { data, error } = await supabase.from('Companions').select('id', {
        count: 'exact'
    }).eq('author', userId)

    if (error) {
        throw new Error(error.message);
    }
    const companioncount = data?.length;

    if (companioncount >= limit) {
        return false;

    } else {
        return true;
    }

}