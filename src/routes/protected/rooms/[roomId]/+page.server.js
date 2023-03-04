import { fail } from "@sveltejs/kit"

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const getMessages = async (roomId) => {
		console.log(roomId)
		const isRoomValid = await locals.sb.from("rooms").select("id").eq("id", roomId)
		console.log(isRoomValid.data)
		if (isRoomValid.data?.length <= 0 || !isRoomValid.data) {
			return fail(404, { message: "Provided room doesn't exist" })
		}

		const messages = await locals.sb
			.from("room_messages")
			.select("*,  messages(content)")
			.eq("room_id", roomId)
			.order("created_at", { ascending: true })

		if (messages.error) {
			return fail(500, { message: `loading messages failed` })
		}

		return messages.data
	}

	return {
		messages: getMessages(params.roomId),
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
			console.log(roomMessage.error)
			return fail(400, { message: "Could not send message" })
		}

		const getRoomId = await locals.sb
			.from("rooms")
			.select("id")
			.or(
				`name.eq.${senderHandle}-${receiverHandle},name.eq.${receiverHandle}-${senderHandle}`
			)
			.maybeSingle()

		const roomMessageRealtion = await locals.sb.from("room_messages").insert([
			{
				room_id: Number(getRoomId.data.id),
				message_id: roomMessage.data.id,
			},
		])

		if (roomMessageRealtion.error) {
			console.log(roomMessageRealtion.error)
			await locals.sb.from("messages").delete().eq("id", roomMessage.data.id)
			return fail(400, { message: "Could not send message" })
		}

		return {
			status: 201,
		}
	},
}
