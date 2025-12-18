import type { RequestHandler } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const GET: RequestHandler = async () => {
    const { data, error } = await supabase.from('users').select('*').limit(1);

    if (error) {
        console.error('Supabase error:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ data }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
