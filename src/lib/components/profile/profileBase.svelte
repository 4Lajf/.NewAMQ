<script>
	export let avatarUrl, username, bio, data
	console.log(data.isSelf)
	import Profile from "./profile.svelte"
	import ProfileSelf from "./profileSelf.svelte"
</script>

<div class="font-sans h-screen w-full flex flex-row justify-center items-center">
	<div class="card w-96 mx-auto bg-slate-800 shadow-xl hover:shadow">
		<img class="w-32 mx-auto rounded-full -mt-20 border-8 border-white" src={avatarUrl} alt="" />
		<div class="text-center mt-2 text-3xl font-medium">{username}</div>
		<div class="px-6 text-center mt-2 font-light text-sm">
			<p>{bio}</p>
		</div>
		<div class="flex p-4">
			{#if data.isSelf === false}
				<Profile avatarUrl, username, bio, data />
			{:else}
				<ProfileSelf avatarUrl, username, bio, data />
			{/if}
		</div>
	</div>
</div>
