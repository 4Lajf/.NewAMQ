import { AuthApiError } from "@supabase/supabase-js"
import { redirect } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"
import { z } from "zod"

const usernameSchema = z.object({
	username: z
		.string({ required_error: "Username is required" })
		.min(1, { message: "Username is required" })
		.max(32, {
			message: "Password must be less than 32 characters",
		})
		.trim(),
})

/** @type {import('./$types').PageServerLoad} */
export async function load(locals) {
	console.log(locals.locals.session.user.user_metadata)
	if (locals.locals.session.user.user_metadata.username) {
		throw redirect(303, "/protected")
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	completeRegistration: async ({ request, locals, url }) => {
		const formData = Object.fromEntries(await request.formData())

		try {
			const usernameData = usernameSchema.parse(formData)
		} catch (err) {
			const { fieldErrors: error } = err.flatten()
			const { ...rest } = formData
			return {
				data: rest,
				error,
			}
		}

		const setUsername = await locals.sb.auth.updateUser({
			data: { username: formData.username },
		})
		console.log("username set")

		if (setUsername.error) {
			console.log(setUsername.error)
			return fail(500, {
				message: "There was a problem contacting the server. Please try again later",
			})
		}

		console.log(locals.session.user.id)
		const setProfileName = await locals.sb
			.from("profiles")
			.update({ username: formData.username })
			.eq("id", locals.session.user.id)

		if (setProfileName.error) {
			console.log(setProfileName.error)
			return fail(500, {
				message: "There was a problem contacting the server. Please try again later",
			})
		}

		const refreshSession = await locals.sb.auth.refreshSession()
		const { session, user } = refreshSession.data

		if (refreshSession.error) {
			console.log(refreshSession.error)
			return fail(500, {
				message: "There was a problem contacting the server. Please try again later",
			})
		}

		throw redirect(303, "/protected")
	},
}
