<script>
	import { enhance } from "$app/forms"
	export let data
	console.log("data: ", data.messages)

	$: ({ messages } = data)
</script>

<main>
	<div class="flex w-full justify-between max-w-xl mx-auto">
		<div>
			<h1>Messages:</h1>
			{#each messages as message}
				<p>{message}</p>
			{/each}
		</div>

		<form action="?/createMessage" method="POST" use:enhance>
			<input type="text" name="message" id="message" placeholder="message" />
			<button type="submit">Send</button>
		</form>
	</div>
</main>
