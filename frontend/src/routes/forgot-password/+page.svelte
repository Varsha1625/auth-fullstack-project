<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let email = '';
  let message = '';
  let error = '';
  let loading = false;

  async function sendResetLink() {
    loading = true;
    message = '';
    error = '';

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (err) {
      error = err.message;
    } else {
      message = '✅ Password reset link sent. Check your email.';
    }

    loading = false;
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
  <h1 class="text-2xl font-bold mb-4">Forgot Password</h1>

  <input
    type="email"
    class="w-full p-3 border rounded mb-3"
    placeholder="Enter your email"
    bind:value={email}
  />

  <button
    type="button"
    class="w-full p-3 bg-blue-600 text-white rounded"
    on:click={sendResetLink}
    disabled={loading}
  >
    {loading ? 'Sending...' : 'Send Reset Link'}
  </button>

  {#if message}
    <p class="text-green-600 mt-4">{message}</p>
  {/if}

  {#if error}
    <p class="text-red-600 mt-4">{error}</p>
  {/if}

  <div class="mt-4 text-center">
    <button
      type="button"
      class="text-blue-600 underline"
      on:click={() => goto('/signin')}
    >
      Back to Sign In
    </button>
  </div>
</div>
