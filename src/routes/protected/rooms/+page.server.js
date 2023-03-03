import { fail } from "@sveltejs/kit"

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals }) => {
	const getRooms = async () => {
		const rooms = await locals.sb.from("rooms").select("*")
		if (rooms.error) {
			return fail(500, { message: rooms.error.message })
		}
		return rooms.data
	}

	return {
		rooms: getRooms(),
	}
}
