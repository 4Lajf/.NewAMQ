import { AuthApiError } from "@supabase/supabase-js"
import { redirect } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"
import { z } from "zod"

const loginSchema = z.object({
	email: z
		.string({ required_error: "E-mail is required" })
		.min(1, { message: "E-mail is required" })
		.max(1024, { message: "E-mail must be less than 1024 characters" })
		.email({ message: "Invalid e-mail address" }),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, { message: "Password is required" })
		.max(1024, {
			message: "Password must be less than 1024 characters",
		})
		.trim(),
})

/** @type {import('./$types').Actions} */
export const actions = {
	login: async ({ request, locals, url }) => {
		const formData = Object.fromEntries(await request.formData())
		const provider = url.searchParams.get("provider")

		if (provider) {
			const signInWithGithub = await locals.sb.auth.signInWithOAuth({
				provider: provider,
			})

			console.log(signInWithGithub.data)

			if (signInWithGithub.error) {
				console.log(signInWithGithub.error)
				return fail(400, {
					message: "Something went wrong, please try again later",
				})
			}

			throw redirect(303, signInWithGithub.data.url)
		}

		try {
			const loginData = loginSchema.parse(formData)
		} catch (err) {
			const { fieldErrors: error } = err.flatten()
			const { password, ...rest } = formData
			return {
				data: rest,
				error,
			}
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
