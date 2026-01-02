<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let loading = false;
  let message = '';
  let isError = false;

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  async function handleSignup() {
    loading = true;
    message = '';
    isError = false;

    if (!navigator.onLine) {
      message = '❌ No internet connection.';
      isError = true;
      loading = false;
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        message = data?.message || '❌ Signup failed.';
        isError = true;
        return;
      }

      message =
        '📧 Signup successful! You can now sign in';

      name = '';
      email = '';
      password = '';

      setTimeout(() => {
        goto('/signin');
      }, 4000);

    } catch (err) {
      console.error(err);
      message = '❌ Server unreachable.';
      isError = true;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-xl bg-white">
  <h1 class="text-3xl font-bold mb-6 text-center">Create Account</h1>

  <div class="space-y-4">
    <input class="w-full p-3 border rounded-lg" placeholder="Full Name" bind:value={name} />
    <input class="w-full p-3 border rounded-lg" placeholder="Email" type="email" bind:value={email} />
    <input class="w-full p-3 border rounded-lg" placeholder="Password" type="password" bind:value={password} />

    <button
      class="w-full p-3 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
      on:click={handleSignup}
      disabled={loading}
    >
      {loading ? 'Creating account...' : 'Sign Up'}
    </button>

    {#if message}
      <p class="text-center mt-3 font-medium"
         class:text-red-600={isError}
         class:text-green-600={!isError}>
        {message}
      </p>
    {/if}
  </div>
</div>
