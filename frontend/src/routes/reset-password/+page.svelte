<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let password = '';
  let message = '';
  let error = '';

  async function updatePassword() {
    const { error: err } = await supabase.auth.updateUser({
      password
    });

    if (err) error = err.message;
    else {
      message = '✅ Password updated successfully';
      setTimeout(() => goto('/signin'), 2000);
    }
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
  <h1 class="text-2xl font-bold mb-4">Reset Password</h1>

  <input
    type="password"
    class="w-full p-3 border rounded mb-3"
    placeholder="New password"
    bind:value={password}
  />

  <button
    class="w-full p-3 bg-green-600 text-white rounded"
    on:click={updatePassword}
  >
    Update Password
  </button>

  {#if message}
    <p class="text-green-600 mt-4">{message}</p>
  {/if}

  {#if error}
    <p class="text-red-600 mt-4">{error}</p>
  {/if}
</div>
