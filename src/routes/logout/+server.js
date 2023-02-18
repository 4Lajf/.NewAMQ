import { redirect } from '@sveltejs/kit'

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals }) {

    const { error: err } = await locals.sb.auth.signOut()

    if (err) {
        throw error(500, `Something went wrong while logging you out. Don't worry it's not SAO, just try again in a minute.`)
    }

    throw redirect(303, '/')
}