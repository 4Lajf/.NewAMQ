import { fail } from "@sveltejs/kit"

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const getMessages = async (roomId) => {
		const messages = await locals.sb
			.from("room_messages")
			.select("*,  messages(content)")
			.eq("room_id", roomId)
			.order("created_at", { ascending: true })

		if (messages.error) {
			throw error(500, { message: messages.error.message })
		}

		return messages.data
	}

	return {
		messages: getMessages(Number(params.roomId)),
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	createMessage: async ({ locals, request, params }) => {
		const { message } = Object.fromEntries(await request.formData())

		const roomMessage = await locals.sb
			.from("messages")
			.insert([{ content: message }])
			.select()
			.single()

		if (roomMessage.error) {
			return fail(400, { message: "Could not send message" })
		}

		const roomMessageRealtion = await locals.sb
			.from("room_messages")
			.insert([{ room_id: Number(params.roomId), message_id: roomMessage.data.id }])

		if (roomMessageRealtion.error) {
			await locals.sb.from("messages").delete().eq("id", roomMessage.data.id)
			return fail(400, { message: "Could not send message" })
		}

		return {
			status: 201,
		}
	},
}
