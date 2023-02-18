<script>
	import { onMount } from 'svelte'
	import { supabaseClient } from '$lib/supabase'
	import { invalidateAll } from '$app/navigation'
	import '../app.css'

	onMount(() => {
		const {
			data: { subscription },
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll()
		})
		return () => {
			subscription.unsubsribe()
		}
	})
</script>

<div class="navbar">
	<a href="/" class="btn">Home</a>
	<a href="/protected" class="btn">Protected</a>
	<form action="/logout" method="POST">
		<button class="btn btn-primary">Logout</button>
	</form>
</div>

<div class="h-full w-full">
	<slot />
</div>
