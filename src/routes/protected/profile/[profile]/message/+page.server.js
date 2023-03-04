import { fail, redirect } from "@sveltejs/kit"

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const getMessages = async (receiverHandle) => {
		console.log("Getting messages...")
		let senderHandle = `@${locals.session.user.user_metadata.username}`

		if (receiverHandle === senderHandle) {
			throw redirect(303, `/protected/profile/${receiverHandle}`)
		}

		let ifDMExists = await locals.sb
			.from("rooms")
			.select("name")
			.or(
				`name.eq.${senderHandle}-${receiverHandle},name.eq.${receiverHandle}-${senderHandle}`
			)
			.maybeSingle()

		console.log("ifDMExists: ", ifDMExists.data)
		if (!ifDMExists.data) {
			await createDMRoom(senderHandle, receiverHandle)
		}

		const getRoomId = await locals.sb
			.from("rooms")
			.select("id")
			.or(
				`name.eq.${senderHandle}-${receiverHandle},name.eq.${receiverHandle}-${senderHandle}`
			)
			.maybeSingle()

		if (!getRoomId.data) {
			return fail(404, { message: "Provided room doesn't exist" })
		}

		const messages = await locals.sb
			.from("room_messages")
			.select("*,  messages(content)")
			.eq("room_id", getRoomId.data.id)
			.order("created_at", { ascending: true })

		if (messages.error) {
			console.log(messages.error)
			return fail(500, { message: `loading room messages failed` })
		}

		console.log("Messages got successfuly!")
		console.log("messagesData: ", messages.data)
		return messages.data
	}

	const createDMRoom = async (senderHandle, receiverHandle) => {
		console.log("Creating DM room...")
		let senderId = locals.session.user.id
		let receiverId = await locals.sb
			.from("profiles")
			.select("id")
			.eq("username", receiverHandle.substr(1))
			.single()

		receiverId = receiverId.data.id
		if (!locals.session) {
			return fail(401, { message: Unauthorized })
		}

		const room = await locals.sb
			.from("rooms")
			.insert([
				{
					name: `${senderHandle}-${receiverHandle}`,
					user_id: senderId,
					isDM: true,
					maxUsers: 2,
				},
			])
			.select()
			.single()

		if (room.error) {
			console.log(room.error)
			return fail(500, { message: "failed initialize DM channel" })
		}

		console.log(receiverId)
		console.log(senderId)
		const roomMember = await locals.sb.from("room_members").insert([
			{ room_id: room.data.id, user_id: senderId },
			{ room_id: room.data.id, user_id: receiverId },
		])

		if (roomMember.error) {
			console.log(roomMember.error)
			return fail(500, { message: "failed to add members to DM channel" })
		}

		const checkMaxUsers = await locals.sb
			.from("room_members")
			.select("room_id")
			.match({ room_id: room.data.id, user_id: senderId })
			.single()

		if (checkMaxUsers.data.length > room.data.maxUsers) {
			const deleteExcessUsers = await locals.sb
				.from("room_members")
				.delete()
				.match({ room_id: room.data.id, user_id: senderId })

			if (deleteExcessUsers.error) {
				return fail(500, {
					message: "failed to delete excess users from channel",
				})
			}
		}

		if (checkMaxUsers.error) {
			console.log(checkMaxUsers.error)
			return fail(500, { message: "failed compare max users" })
		}
		console.log("DM room created successfully!")
	}

	return {
		messages: getMessages(params.profile),
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

		const findId = async (receiverHandle) => {
			let receiverId = await locals.sb
				.from("profiles")
				.select("id")
				.eq("username", receiverHandle.substring(1))
				.single()
			return receiverId.data.id
		}
		let roomId = findId(params.profile)

		const roomMessageRealtion = await locals.sb.from("room_messages").insert([
			{
				room_id: Number(roomId),
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
