<script lang="ts">
  import { supabase } from '$lib/supabaseClient';

  let email = '';
  let message = '';
  let error = '';

  const sendResetLink = async () => {
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    });

    if (err) error = err.message;
    else message = 'Password reset link sent to your email';
  };
</script>

<h1>Forgot Password</h1>

<input type="email" bind:value={email} placeholder="Enter email" />
<button on:click={sendResetLink}>Send reset link</button>

{#if message}<p style="color:green">{message}</p>{/if}
{#if error}<p style="color:red">{error}</p>{/if}
