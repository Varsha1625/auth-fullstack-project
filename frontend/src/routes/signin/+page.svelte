<script lang="ts">
  let email = '';
  let password = '';

  let loading = false;
  let message = '';

  async function handleSignin() {
    loading = true;
    message = '';

    try {
      const res = await fetch('http://localhost:3000/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        message = "❌ " + (data.message || "Login failed");
      } else {
        message = "✅ Logged in!";
        email = password = "";
      }
    } catch (err: any) {
      message = "❌ Network error: " + err.message;
    }

    loading = false;
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
    />

    <input
      class="w-full p-3 border rounded-lg"
      placeholder="Password"
      type="password"
      bind:value={password}
    />

    <button
      class="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
      on:click={handleSignin}
      disabled={loading}
    >
      {loading ? "Logging in..." : "Sign In"}
    </button>

    {#if message}
      <p class="text-center mt-3">{message}</p>
    {/if}
  </div>
</div>
