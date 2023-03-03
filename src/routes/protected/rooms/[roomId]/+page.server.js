import { fail } from "@sveltejs/kit"

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const getMessages = async (roomId) => {
		console.log(roomId)
		if (roomId.toString().startsWith("@")) {
			const isDMValid = await locals.sb
				.from("rooms")
				.select("id")
				.eq("name", roomId)
				.eq("isDM", true)
			if (isDMValid.data.length < 1) {
				return fail(404, { message: "Provided room doesn't exist" })
			}
			roomId = isDMValid.data[0].id
		} else {
			const isRoomValid = await locals.sb
				.from("rooms")
				.select("id")
				.eq("id", roomId)
			console.log(isRoomValid.data)
			if (isRoomValid.data?.length < 1 || !isRoomValid.data) {
				return fail(404, { message: "Provided room doesn't exist" })
			}
		}

		const messages = await locals.sb
			.from("room_messages")
			.select("*,  messages(content)")
			.eq("room_id", roomId)
			.order("created_at", { ascending: true })

		if (messages.error) {
			return fail(500, { message: messages.error.message })
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
		if (params.roomId.startsWith("@")) {
			const findDMId = await locals.sb
				.from("rooms")
				.select("id")
				.eq("name", params.roomId)
				.eq("isDM", true)
			params.roomId = findDMId.data[0].id
		}

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

		const roomMessageRealtion = await locals.sb
			.from("room_messages")
			.insert([
				{
					room_id: Number(params.roomId),
					message_id: roomMessage.data.id,
				},
			])

		if (roomMessageRealtion.error) {
			console.log(roomMessageRealtion.error)
			await locals.sb
				.from("messages")
				.delete()
				.eq("id", roomMessage.data.id)
			return fail(400, { message: "Could not send message" })
		}

		return {
			status: 201,
		}
	},
}
