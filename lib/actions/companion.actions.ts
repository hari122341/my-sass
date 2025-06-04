'use server'

import { auth } from '@clerk/nextjs/server'
import { createSupabaseClient } from '../supabase';
// import {CreateCompanion} from '@/types'
interface CreateCompanion {
    name: string;
    subject: string;
    topic: string;
    style: string;
    voice: string;
    duration: number;
}

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