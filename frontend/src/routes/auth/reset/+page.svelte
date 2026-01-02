<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let password = '';
  let confirmPassword = '';
  let error = '';
  let success = '';

  const updatePassword = async () => {
    if (password !== confirmPassword) {
      error = 'Passwords do not match';
      return;
    }

    const { error: err } = await supabase.auth.updateUser({
      password
    });

    if (err) error = err.message;
    else {
      success = 'Password updated successfully';
      setTimeout(() => goto('/login'), 1500);
    }
  };
</script>

<h1>Reset Password</h1>

<input type="password" bind:value={password} placeholder="New password" />
<input type="password" bind:value={confirmPassword} placeholder="Confirm password" />

<button on:click={updatePassword}>Update Password</button>

{#if success}<p style="color:green">{success}</p>{/if}
{#if error}<p style="color:red">{error}</p>{/if}
