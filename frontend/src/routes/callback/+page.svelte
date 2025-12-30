<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let message = 'Verifying your email...';

  onMount(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
      message = 'Verification failed. Please login again.';
      setTimeout(() => goto('/signin'), 2000);
      return;
    }

    // ✅ Store access token if your backend needs it
    localStorage.setItem(
      'token',
      data.session.access_token
    );

    message = 'Email verified! Redirecting...';

    setTimeout(() => goto('/dashboard'), 1500);
  });
</script>

<h2 class="text-center mt-20 text-xl font-semibold">
  {message}
</h2>
