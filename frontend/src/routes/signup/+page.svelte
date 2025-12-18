<script lang="ts">
  import { goto } from '$app/navigation';
  let name = '';
  let email = '';
  let password = '';
  let loading = false;
  let message = '';

  async function handleSignup() {
    loading = true;
    message = '';

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();

      if (!res.ok) {
        message = '❌ ' + (data.message || 'Signup failed');
        loading = false;
        return;
      }

      // Show verification message instead of redirecting immediately
      message = data.message || '✅ Signup successful. Please verify your email!';

      // Optional: redirect to signin page after a few seconds
      setTimeout(() => goto('/auth/signin'), 5000);

      // Clear form
      name = '';
      email = '';
      password = '';

    } catch (err: any) {
      message = '❌ Network error: ' + err.message;
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
      {loading ? "Creating account..." : "Sign Up"}
    </button>

    {#if message}
      <p class="text-center mt-3">{message}</p>
    {/if}
  </div>
</div>
