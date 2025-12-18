<h1>Welcome to Auth App</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<script>
	import { goto } from '$app/navigation';
</script>

<div class="min-h-screen flex flex-col justify-center items-center bg-gray-100">
	<h1 class="text-4xl font-bold mb-6">Welcome to SecureAuth</h1>

	<div class="space-x-4">
		<button
			on:click={() => goto('/signup')}
			class="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600"
		>
			Sign Up
		</button>

		<button
			on:click={() => goto('/signin')}
			class="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
		>
			Sign In
		</button>
	</div>
</div>
