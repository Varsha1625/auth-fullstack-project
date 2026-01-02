<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let loading = false;
  let message = '';
  let isError = false;

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  async function handleSignin() {
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
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log('SIGNIN RESPONSE:', data);

      if (!res.ok) {
        message = data?.message || '❌ Invalid email or password.';
        isError = true;
        return;
      }

      if (!data.token) {
        message = '❌ Login failed. Token missing.';
        isError = true;
        return;
      }

      localStorage.setItem('token', data.token);

      message = '✅ Login successful! Redirecting...';

      email = '';
      password = '';

      setTimeout(() => {
        goto('/dashboard');
      }, 800);

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
  <h1 class="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

  <div class="space-y-4">
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

    <!-- ✅ FORGOT PASSWORD LINK (FIXED & VISIBLE) -->
    <div class="text-right">
      <a
        href="/forgot-password"
        class="text-sm text-blue-600 hover:underline"
      >
        Forgot password?
      </a>
    </div>

    <button
      class="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      on:click={handleSignin}
      disabled={loading}
    >
      {loading ? 'Logging in...' : 'Sign In'}
    </button>

    {#if message}
      <p
        class="text-center mt-4 font-medium"
        class:text-red-600={isError}
        class:text-green-600={!isError}
      >
        {message}
      </p>
    {/if}
  </div>
</div>
