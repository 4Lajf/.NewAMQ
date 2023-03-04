<script>
	import { enhance } from "$app/forms"
</script>

<div class=" w-1/3">
	<form class="" method="POST" use:enhance>
		<button formaction="?/openDM" class="border-none font-bold">Message</button>
	</form>
</div>
<div class="w-0 border border-gray-300" />
<div class="w-1/3">
	<form class="" method="POST" use:enhance>
		<button formaction="?/addFriend" class="border-none font-bold">Add Friend</button>
	</form>
</div>
<div class="w-0 border border-gray-300" />
<div class="w-1/3">
	<form class="" method="POST" use:enhance>
		<button formaction="?/block" class="border-none font-bold">Block</button>
	</form>
</div>
