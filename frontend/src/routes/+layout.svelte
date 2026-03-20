<script lang="ts">
	import "../app.css";
	import favicon from '$lib/assets/favicon.svg';

	import {onMount} from "svelte";
	import {goto} from "$app/navigation";

    onMount(() => {
		const hash = window.location.hash;

		//Detect supabase password recovery
		if(hash && hash.includes("type=recovery")){
			setTimeout(() =>{
			goto("/reset-password");
		},500);
	}
});

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main>
	<slot />
</main>
