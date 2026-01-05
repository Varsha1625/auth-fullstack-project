<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let loading = false;
  let message = '';
  let isError = false;

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  async function handleSignin() {
    if (!API_URL) {
      message = 'Backend URL not configured';
      isError = true;
      return;
    }

    loading = true;
    message = '';
    isError = false;

    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        message = data?.message || 'Invalid email or password';
        isError = true;
        return;
      }

      if (!data?.token) {
        message = 'Login failed. Token missing.';
        isError = true;
        return;
      }

      // ✅ Save token safely
      localStorage.setItem('token', data.token);

      // ✅ Ensure navigation always happens
      await goto('/dashboard', { replaceState: true });

    } catch (err) {
      console.error(err);
      message = 'Server unreachable';
      isError = true;
    } finally {
      loading = false;
    }
  }

  function openForgotPassword() {
    goto('/forgot-password');
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-xl bg-white">
  <h1 class="text-3xl font-bold mb-6 text-center">
    Welcome Back
  </h1>

  <input
    class="w-full p-3 border rounded-lg mb-3"
    placeholder="Email"
    type="email"
    bind:value={email}
  />

  <input
    class="w-full p-3 border rounded-lg mb-2"
    placeholder="Password"
    type="password"
    bind:value={password}
  />

  <!-- ✅ FIXED FORGOT PASSWORD -->
  <div class="text-right mb-4">
    <button
      type="button"
      on:click={openForgotPassword}
      class="text-sm text-blue-600 hover:underline"
    >
      Forgot password?
    </button>
  </div>

  <button
    type="button"
    class="w-full p-3 bg-green-600 text-white rounded-lg disabled:opacity-50"
    on:click={handleSignin}
    disabled={loading}
  >
    {loading ? 'Logging in…' : 'Sign In'}
  </button>

  {#if message}
    <p class="text-center mt-4 {isError ? 'text-red-600' : 'text-green-600'}">
      {message}
    </p>
  {/if}
</div>
