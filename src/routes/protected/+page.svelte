<script>
	import { enhance } from "$app/forms"
	import { supabaseClient } from "$lib/supabase"
	import { onMount } from "svelte"

	let channel
	let messages = []
	onMount(async () => {
		channel = supabaseClient
			.channel("room1")
			.on("broadcast", { event: "message" }, ({ payload }) => {
				console.log(payload)
				messages.push(payload.message)
				messages = messages
			})
			.subscribe((status) => {
				if (status === "SUBSCRIBED") {
					console.log("subscribed")
				}
			})
	})

	const submitMessage = ({ data }) => {
		const { message } = Object.fromEntries(data)
		channel.send({
			type: "brodcast",
			event: "message",
			payload: { message },
		})
		return async ({ result, update }) => {
			switch (result.type) {
				case "success":
					break
				case "failure":
					break
				default:
					break
			}
			await update()
		}
	}
</script>

<main>
	<div class="flex w-full justify-between max-w-xl mx-auto">
		<div>
			<h1>Messages:</h1>
			{#each messages as message}
				<p>{message}</p>
			{/each}
		</div>
		<form action="?/sendMessage" use:enhance={submitMessage} method="POST">
			<input type="text" name="message" />
			<button type="submit">Send</button>
		</form>

		<form action="?/deleteAccount" use:enhance method="POST">
			<button type="submit">Delete Account</button>
		</form>
	</div>
</main>
