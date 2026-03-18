<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';
  
  let email:string = "";
  let message:string = "";
  let error:string = "";
  let loading:boolean = false;

  async function sendResetLink() {
    loading = true;
    message = '';
    error = '';

    try{
      if(!email){
        error = "Email is required";
        loading = false;
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:'https://fronted-dashboard-87.vercel.app/reset-password'
    });

    if (resetError) {
      throw resetError;
    } 
      message = '✅ Password reset link sent. Check your email.';
  } catch(e:any){
    console.error("RESET ERROR:",e);
    error = e?.message||"Error sending recovery email";
  }finally{

    loading = false;
  }
}
</script>

<div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
  <h1 class="text-2xl font-bold mb-4">Forgot Password</h1>

  <input
    type="email"
    class="w-full p-3 border rounded mb-3"
    placeholder="Enter your email"
    bind:value={email}
  />

  <button
    type="button"
    class="w-full p-3 bg-blue-600 text-white rounded"
    on:click={sendResetLink}
    disabled={loading}
  >
    {loading ? 'Sending...' : 'Send Reset Link'}
  </button>

  {#if message}
    <p class="text-green-600 mt-4">{message}</p>
  {/if}

  {#if error}
    <p class="text-red-600 mt-4">{error}</p>
  {/if}

  <div class="mt-4 text-center">
    <button
      type="button"
      class="text-blue-600 underline"
      on:click={() => goto('/signin')}
    >
      Back to Sign In
    </button>
  </div>
</div>
