import { fail, redirect } from "@sveltejs/kit"

/** @type {import('./$types').PageServerLoad} */
export const load = async ({ locals, params }) => {
	const findId = async (receiverHandle) => {
		let receiverId = await locals.sb
			.from("profiles")
			.select("id")
			.eq("username", receiverUsername)
			.single()
		return receiverId.data.id
	}

	let receiverUsername = params.profile.substring(1)
	let receiverId = await findId(params.profile)

	const loadProfileData = async (receiverHandle) => {
		let profileData = await locals.sb
			.from("profiles")
			.select("avatar_url, bio")
			.eq("id", receiverId)
			.single()
		return profileData.data
	}

	const isSelf = async (receiverHandle) => {
		if (receiverHandle === `@${locals.session.user.user_metadata.username}`) {
			return true
		} else {
			return false
		}
	}

	return {
		profileData: loadProfileData(params.profile),
		isSelf: isSelf(params.profile),
		params: params,
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	openDM: async ({ locals, request, params }) => {
		console.log("openDM")
		throw redirect(303, "message")
	},

	addFriend: async ({ locals, request, params }) => {
		console.log("addFriend")
		return {
			status: 201,
		}
	},

	block: async ({ locals, request, params }) => {
		console.log("block")
		return {
			status: 201,
		}
	},
}
