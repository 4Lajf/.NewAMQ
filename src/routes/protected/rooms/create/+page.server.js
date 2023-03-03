import { supabaseClient } from "$lib/supabase"
import { fail } from "@sveltejs/kit"

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ locals, request }) => {
		if (!locals.session) {
			return fail(401, { message: Unauthorized })
		}
		const { name } = Object.fromEntries(await request.formData())

		const room = await locals.sb
			.from("rooms")
			.insert([{ name, user_id: locals.session.user.id }])
			.select()
			.single()

		if (room.error) {
			console.log(room.error)
			return fail(500, { message: room.error.message })
		}

		const roomMember = await locals.sb
			.from("room_members")
			.insert([
				{ room_id: room.data.id, user_id: locals.session.user.id },
			])

		if (roomMember.error) {
			console.log(roomMember.error)
			return fail(500, { message: roomMember.error.message })
		}

		return {
			status: 201,
		}
	},
}
