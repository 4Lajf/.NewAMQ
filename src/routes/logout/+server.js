import { redirect } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"

/** @type {import('./$types').RequestHandler} */
export async function POST({ locals }) {
	const logout = await locals.sb.auth.signOut()
	if (logout.error) {
		return fail(500, {
			message: `Something went wrong while logging you out. Don't worry it's not SAO, just try again in a minute.`,
		})
	}

	throw redirect(303, "/")
}
