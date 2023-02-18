<script>
	import { enhance } from '$app/forms';
	export let form;
</script>

<main>
	<h1>Register</h1>
	<form action="?/register" method="POST" class="auth-form" use:enhance>
		<label for="username"> Username </label>
		<input
			type="text"
			name="username"
			value={form?.data?.username ?? ''}
			class={form?.errors?.username ? 'border-red-500' : 'border-slate-500'} />
		<label for="username">
			{JSON.stringify(form?.data)}
			{#if form?.errors?.username}
				<span class="text-red-400">{form?.errors?.username[0]}</span>
			{/if}
		</label>
		<label for="email"> E-mail </label>
		<input
			type="text"
			name="email"
			value={form?.data?.email ?? ''}
			class={form?.errors?.email ? 'border-red-500' : 'border-slate-500'} />
		<label for="email">
			{#if form?.errors?.email}
				<span class="text-red-400">{form?.errors?.email[0]}</span>
			{/if}
		</label>
		<label for="passowrd"> Password </label>
		<input
			type="password"
			name="password"
			class={form?.errors?.password ? 'border-red-500' : 'border-slate-500'} />
		<label for="password">
			{#if form?.errors?.password}
				<span class="text-red-400">{form?.errors?.password[0]}</span>
			{/if}
		</label>
		<label for="confirmPassword"> Confirm Password </label>
		<input
			type="password"
			name="confirmPassword"
			class={form?.errors?.confirmPassword ? 'border-red-500' : 'border-slate-500'} />
		<label for="confirmPassword">
			{#if form?.errors?.confirmPassword}
				<span class="text-red-400">{form?.errors?.confirmPassword[0]}</span>
			{/if}
			<button type="submit" class="btn btn-primary">Register</button>
		</label>
	</form>
</main>

<style lang="scss">
	$dark-300: hsl(213, 24%, 7%);
	$dark-200: hsl(222, 15%, 13%);
	$dark-100: hsl(222, 15%, 19%);
	$primary-300: hsl(149, 77%, 46%);
	$primary-200: hsl(149, 77%, 56%);
	$primary-100: hsl(149, 77%, 66%);
	$secondary-300: hsl(289, 90%, 53%);
	$secondary-200: hsl(289, 90%, 63%);
	$secondary-100: hsl(289, 90%, 73%);
	$gray: hsl(212, 15%, 48%);

	body {
		background: $dark-200;
		color: #ffffff;
		font-size: 18px;
	}

	main {
		padding: 2rem;
		text-align: center;
	}

	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100vh;
		padding: 0 20px;
	}

	.auth-buttons {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 1rem;
		gap: 1rem;
	}

	.card {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		background-color: $dark-200;
		border-radius: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
		padding: 32px;
	}

	.btn {
		color: $dark-300;
		border: none;
		border-radius: 5px;
		padding: 10px 20px;
		font-size: 16px;
		cursor: pointer;
		transition: all 0.2s ease-in-out;

		&:hover {
			text-decoration: none;
		}
	}

	.btn-primary {
		background-color: $primary-200;
		color: $dark-300;

		&:hover {
			background-color: $primary-300;
		}
	}

	.btn-secondary {
		background-color: $secondary-200;
		color: $dark-300;

		&:hover {
			background-color: $secondary-300;
		}
	}

	input {
		background-color: $dark-100;
		padding: 10px 20px;
		color: #ffffff;
		font-size: 16px;
		margin-bottom: 20px;

		&:focus {
			outline: $primary-300 2px solid;
		}
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 400px;
		min-width: 400px;
		margin: 0 auto;

		& label {
			text-align: left;
			padding-bottom: 2px;
			font-size: 16px;
		}
	}
</style>
