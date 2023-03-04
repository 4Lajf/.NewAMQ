import { createClient } from "@supabase/auth-helpers-sveltekit"
import { PUBLIC_SUPABASE_URL } from "$env/static/public"
import { redirect } from "@sveltejs/kit"
import { fail } from "@sveltejs/kit"

/** @type {import('./$types').Actions} */
export const actions = {
	sendMessage: async ({ request, locals }) => {
		const { message } = Object.fromEntries(await request.formData())

		const channel = locals.sb.channel("room1")
		channel.subscribe((status) => {
			if (status === "SUBSCRIBED") {
				console.log("subscribed")
			}
		})

		channel.send({
			type: "broadcast",
			event: "message",
			payload: { message },
		})

		return {
			status: 200,
		}
	},

	deleteAccount: async ({ request, locals }) => {
		const {
			data: { user },
		} = await locals.sb.auth.getUser()
		console.log(user.id)

		const supabaseServer = createClient(
			PUBLIC_SUPABASE_URL,
			/* service role key  */ "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Y2huZ3d5dXphcGxrbWxqd29zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NjI0MTU5MSwiZXhwIjoxOTkxODE3NTkxfQ.u9DLeXrRj7JhC_lT6H6C1hDkTJlBzB_Z7whyoiF0r6w"
		)

		const logout = await locals.sb.auth.signOut()

		if (logout.error) {
			console.log(logout.error)
			return fail(500, {
				message: `Something went wrong while deleting your account. Try again later`,
			})
		}

		const roomMembersDelete = await supabaseServer.from("room_members").delete().eq("user_id", user.id)

		if (roomMembersDelete.error) {
			console.log(roomMembersDelete.error)
			return fail(500, {
				message: `Something went wrong while deleting your account. Try again later`,
			})
		}

		const selectRooms = await supabaseServer.from("rooms").select("*").eq("user_id", user.id)
		let roomsToDelete = []
		selectRooms.data.forEach((el) => {
			roomsToDelete.push(el.id)
		})

		if (selectRooms.error) {
			console.log(selectRooms.error)
			return fail(500, {
				message: `Something went wrong while deleting your account. Try again later`,
			})
		}

		roomsToDelete.forEach(async (room_id) => {
			const roomMessagesDelete = await supabaseServer.from("room_messages").delete().eq("room_id", room_id)

			if (roomMessagesDelete.error) {
				console.log(roomMessagesDelete.error)
				return fail(500, {
					message: `Something went wrong while deleting your account. Try again later`,
				})
			}
		})

		const deleteRooms = await supabaseServer.from("rooms").delete().eq("user_id", user.id)

		if (deleteRooms.error) {
			console.log(deleteRooms.error)
			return fail(500, {
				message: `Something went wrong while deleting your account. Try again later`,
			})
		}

		const deleteAccount = await supabaseServer.auth.admin.deleteUser(user.id)

		if (deleteAccount.error) {
			console.log(deleteAccount.error)
			return fail(500, {
				message: `Something went wrong while deleting your account. Try again later`,
			})
		}

		throw redirect(303, "/")
	},
}
