<script>
	import { enhance } from "$app/forms"
	export let data

	$: ({ messages } = data)

	const submitNewMessage = () => {
		return async ({ update }) => {
			await update()
		}
	}
</script>

<main>
	<div class="flex w-full justify-between max-w-xl mx-auto">
		<div>
			<h1>Messages:</h1>
			{#each messages as message}
				<p>{message.messages.content}</p>
			{/each}
		</div>

		<form action="?/createMessage" method="POST" use:enhance={submitNewMessage}>
			<input type="text" name="message" id="message" placeholder="message" />
			<button type="submit">Send</button>
		</form>
	</div>
</main>
