import { fail, redirect } from "@sveltejs/kit"
import { z } from "zod"

const registerSchema = z
	.object({
		username: z
			.string({ required_error: "Username is required" })
			.min(1, { message: "Username is required" })
			.max(32, { message: "Username must be less than 32 characters" })
			.trim(),
		email: z
			.string({ required_error: "E-mail is required" })
			.min(1, { message: "E-mail is required" })
			.max(1024, { message: "E-mail must be less than 1024 characters" })
			.email({ message: "Invalid e-mail address" }),
		password: z
			.string({ required_error: "Password is required" })
			.min(8, { message: "Password must be at least 8 characters" })
			.max(1024, {
				message: "Password must be less than 1024 characters",
			})
			.trim(),
		confirmPassword: z
			.string({ required_error: "Password is required" })
			.min(8, { message: "Password must be at least 8 characters" })
			.max(1024, {
				message: "Password must be less than 1024 characters",
			})
			.trim(),
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: "custom",
				message: "Passwords must match",
				path: ["confirmPassword"],
			})
		}
	})

/** @type {import('./$types').Actions} */
export const actions = {
	register: async ({ request, locals, url }) => {
		const formData = Object.fromEntries(await request.formData())
		const provider = url.searchParams.get("provider")

		if (provider) {
			const signInWithGithub = await locals.sb.auth.signInWithOAuth({
				provider: provider,
			})

			if (signInWithGithub.error) {
				console.log(signInWithGithub.error)
				return fail(400, {
					message: "Something went wrong, please try again later",
				})
			}

			throw redirect(303, signInWithGithub.data.url)
		}

		try {
			const registerData = registerSchema.parse(formData)
		} catch (err) {
			const { fieldErrors: errors } = err.flatten()
			const { password, confirmPassword, ...rest } = formData
			return {
				data: rest,
				errors,
			}
		}

		const signUp = await locals.sb.auth.signUp({
			email: formData.email,
			password: formData.password,
		})

		if (signUp.error) {
			console.log(signUp.error)
			return fail(500, {
				message: "There was a problem contacting the server. Please try again later",
			})
		}

		const setUsername = await locals.sb.auth.updateUser({
			data: { username: formData.username },
		})

		if (setUsername.error) {
			console.log(setUsername.error)
			return fail(500, {
				message: "There was a problem contacting the server. Please try again later",
			})
		}

		const setProfileName = await locals.sb.from("profiles").update({ username: formData.username }).eq("id", signUp.data.user.id)

		if (setProfileName.error) {
			console.log(setProfileName.error)
			return fail(500, {
				message: "There was a problem contacting the server. Please try again later",
			})
		}

		const refreshSession = await locals.sb.auth.refreshSession()
		const { session, user } = refreshSession.data

		throw redirect(303, "/")
	},
}
