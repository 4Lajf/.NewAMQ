import '$lib/supabase'
import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import { redirect } from '@sveltejs/kit'

export const handle = async ({ event, resolve }) => {
    const { session, supabaseClient } = await getSupabase(event)

    event.locals.sb = supabaseClient
    event.locals.session = session

    if (event.url.pathname.startsWith('/protected')) {
        if (!event.locals.session) {
            throw redirect(303, '/')
        }
/*         if (event.url.pathname.startsWith('/protected/admin')) {
            if (event.locals.session.role !== 'ADMIN') {
                throw redirect(303, '/protected')
            }
        } */
    }

    const reponse = await resolve(event)
    return reponse
}