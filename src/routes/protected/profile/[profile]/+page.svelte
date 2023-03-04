<script>
	import { enhance } from "$app/forms"
	export let data
	// console.log(data)
	// console.log(data.messages)

	// $: ({ messages } = data)

	// const submitNewMessage = () => {
	// 	return async ({ update }) => {
	// 		await update()
	// 	}
	// }

	import ProfileBase from "$lib/components/profile/profileBase.svelte"
</script>

<ProfileBase
	avatarUrl={data.profileData.avatar_url}
	username={data.params.profile}
	bio={data.profileData.bio}
	data={data} />
