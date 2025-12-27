<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';
  let loading = false;
  let message = '';
  let isError = false;

  // ✅ backend URL from env
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  async function handleSignup() {
    loading = true;
    message = '';
    isError = false;

    // ✅ handle no internet
    if (!navigator.onLine) {
      message = '❌ No internet connection. Please check your network.';
      isError = true;
      loading = false;
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error('Invalid server response');
      }

      if (!res.ok) {
        message = data.message
          ? `❌ ${data.message}`
          : '❌ Signup failed. Please try again.';
        isError = true;
        return;
      }

      // ✅ success message
      message =
        data.message ||
        '✅ Signup successful! Please verify your email before signing in.';

      // clear form
      name = '';
      email = '';
      password = '';

      // redirect after delay
      setTimeout(() => {
        goto('/signin');
      }, 5000);

    } catch (err: any) {
      message =
        '❌ Server is unreachable. Please try again later.';
      isError = true;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-xl bg-white">
  <h1 class="text-3xl font-bold mb-6 text-center">Create Account</h1>

  <div class="space-y-4">
    <input
      class="w-full p-3 border rounded-lg"
      placeholder="Full Name"
      bind:value={name}
      required
    />

    <input
      class="w-full p-3 border rounded-lg"
      placeholder="Email"
      type="email"
      bind:value={email}
      required
    />

    <input
      class="w-full p-3 border rounded-lg"
      placeholder="Password"
      type="password"
      bind:value={password}
      required
    />

    <button
      class="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      on:click={handleSignup}
      disabled={loading}
    >
      {loading ? 'Creating account...' : 'Sign Up'}
    </button>

    {#if message}
      <p
        class="text-center mt-3 font-medium"
        class:text-red-600={isError}
        class:text-green-600={!isError}
      >
        {message}
      </p>
    {/if}
  </div>
</div>
