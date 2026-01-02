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

    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        message = data?.message || 'Invalid email or password';
        isError = true;
        return;
      }

      localStorage.setItem('token', data.token);
      goto('/dashboard');

    } catch {
      message = 'Server unreachable';
      isError = true;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-xl bg-white">
  <h1 class="text-3xl font-bold mb-6 text-center">Welcome Back</h1>

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

  <!-- ✅ FORGOT PASSWORD (VISIBLE GUARANTEED) -->
  <div class="text-right mb-4">
    <a href="/forgot-password" class="text-sm text-blue-600 hover:underline">
      Forgot password?
    </a>
  </div>

  <button
    class="w-full p-3 bg-green-600 text-white rounded-lg"
    on:click={handleSignin}
    disabled={loading}
  >
    {loading ? 'Logging in...' : 'Sign In'}
  </button>

  {#if message}
    <p class="text-center mt-4" class:text-red-600={isError}>
      {message}
    </p>
  {/if}
</div>
