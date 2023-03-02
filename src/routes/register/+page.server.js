import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';

const registerSchema = z
	.object({
		username: z
			.string({ required_error: 'Username is required' })
			.min(1, { message: 'Username is required' })
			.max(32, { message: 'Username must be less than 32 characters' })
			.trim(),
		email: z
			.string({ required_error: 'E-mail is required' })
			.min(1, { message: 'E-mail is required' })
			.max(1024, { message: 'E-mail must be less than 1024 characters' })
			.email({ message: 'Invalid e-mail address' }),
		password: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(1024, { message: 'Password must be less than 1024 characters' })
			.trim(),
		confirmPassword: z
			.string({ required_error: 'Password is required' })
			.min(8, { message: 'Password must be at least 8 characters' })
			.max(1024, { message: 'Password must be less than 1024 characters' })
			.trim()
	})
	.superRefine(({ confirmPassword, password }, ctx) => {
		if (confirmPassword !== password) {
			ctx.addIssue({
				code: 'custom',
				message: 'Passwords must match',
				path: [ 'confirmPassword' ]
			});
		}
	});

/** @type {import('./$types').Actions} */
export const actions = {
	register: async ({ request, locals }) => {
		const formData = Object.fromEntries(await request.formData());

		try {
			const result = registerSchema.parse(formData);
			console.log('success');
			console.log(result);
		} catch (err) {
			const { fieldErrors: errors } = err.flatten();
			const { password, confirmPassword, ...rest } = formData;
			return {
				data: rest,
				errors
			};
		}

		const { data, error: err } = await locals.sb.auth.signUp({
			email: formData.email,
			password: formData.password
		});

		if (err) {
			return fail(500, {
				error: 'There was a problem contacting the server. Please try again later'
			});
		}
		throw redirect(303, '/');
	}
};
