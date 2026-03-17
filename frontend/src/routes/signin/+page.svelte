<script lang="ts">
  import { goto } from '$app/navigation';

  let step = 1;
  let email = '';
  let password = '';
  let loading = false;
  let message = '';
  let isError = false;

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function nextStep() {
    message = '';
    isError = false;

    if (!isValidEmail(email)) {
      message = 'Enter a valid email address';
      isError = true;
      return;
    }

    step = 2;
  }

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
        message = 'Wrong password or account not found';
        isError = true;
        return;
      }

      if (!data?.token) {
        message = 'Login failed. Token missing.';
        isError = true;
        return;
      }

      // ✅ Save token
      localStorage.setItem('token', data.token);

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

  function backToEmail() {
    step = 1;
    password = '';
    message = '';
    isError = false;
  }
</script>

<div class="max-w-md mx-auto mt-24 p-8 rounded-2xl shadow-xl bg-white">

  <h1 class="text-2xl font-medium mb-6">
    Sign in
  </h1>

  {#if step === 1}
    <!-- STEP 1: EMAIL -->

    <input
      class="w-full p-3 border rounded-lg mb-3"
      placeholder="Email"
      type="email"
      bind:value={email}
    />

    {#if message}
      <p class="text-sm mb-3 {isError ? 'text-red-600' : 'text-green-600'}">
        {message}
      </p>
    {/if}

    <button
      type="button"
      class="w-full p-3 bg-blue-600 text-white rounded-lg"
      on:click={nextStep}
    >
      Next
    </button>

  {:else}
    <!-- STEP 2: PASSWORD -->

    <p class="text-gray-600 mb-3 text-sm">
      {email}
    </p>

    <input
      class="w-full p-3 border rounded-lg mb-2"
      placeholder="Enter your password"
      type="password"
      bind:value={password}
    />

    <div class="flex justify-between items-center mb-4">
      <button
        type="button"
        class="text-sm text-blue-600 hover:underline"
        on:click={backToEmail}
      >
        Change email
      </button>

      <button
        type="button"
        class="text-sm text-blue-600 hover:underline"
        on:click={openForgotPassword}
      >
        Forgot password?
      </button>
    </div>

    {#if message}
      <p class="text-sm mb-3 {isError ? 'text-red-600' : 'text-green-600'}">
        {message}
      </p>
    {/if}

    <button
      type="button"
      class="w-full p-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
      on:click={handleSignin}
      disabled={loading}
    >
      {loading ? 'Signing in…' : 'Sign in'}
    </button>
  {/if}
</div>