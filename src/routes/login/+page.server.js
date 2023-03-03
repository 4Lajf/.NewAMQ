import { AuthApiError } from "@supabase/supabase-js"
import { redirect } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, locals, url }) => {
		const formData = Object.fromEntries(await request.formData())
		const provider = url.searchParams.get("provider")

		if (provider) {
			const { data, error: err } = await locals.sb.auth.signInWithOAuth({
				provider: provider,
			})

			if (err) {
				console.log(err)
				return fail(400, {
					message: "Something went wrong, please try again later",
				})
			}

			throw redirect(303, data.url)
		}

		const { data, error: err } = await locals.sb.auth.signInWithPassword({
			email: formData.email,
			password: formData.password,
		})
		if (err) {
			console.log(err)
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: "Invalid e-mail or password",
				})
			}

			console.log(err)
			return fail(500, {
				error: "There was a problem contacting the server. Please try again later",
			})
		}
		throw redirect(303, "/")
	},
}
