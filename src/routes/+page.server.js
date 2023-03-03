import { redirect } from "@sveltejs/kit"

/** @type {import('./$types').PageServerLoad} */
export async function load(locals) {
	if (locals.locals.session) {
		throw redirect(303, "/protected")
	}
}
