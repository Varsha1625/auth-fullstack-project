<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let password:string = '';
  let confirmPassword:string = '';
  let message:string = '';
  let error:string = '';
  let loading:boolean = false;

  async function updatePassword(){
    loading = true;
    message = '';
    error = '';
    
    try{
      
      if(!password ||!confirmPassword){
        error = "All fields are required";
        loading = false;
        return;
  }
      if(password !== confirmPassword){
        error = "Passwords do not match";
        loading = false;
        return;
  }
      if(password.length < 8){
        error = "Password must be atleast 8 characters";
        loading = false;
        return;
  }
    const{error: updateError} = await supabase.auth.updateUser({password:password});

    if(updateError){
      throw updateError;
    }

    message = 'Password updated successfully';

    setTimeout(() => {
      goto('/signin');
    },2000);

  }catch(e:any){
     console.error("RESET PASSWORD ERROR:",e);
     error = e?.message||"Failed to update password";
  }finally{
    loading = false;
  }
}
</script>

<div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow">
  <h1 class="text-2xl font-bold mb-4">Reset Password</h1>

  <input
    type="password"
    class="w-full p-3 border rounded mb-3"
    placeholder="New password"
    bind:value={password}
  />

  <input
    type="password"
    class="w-full p-3 border rounded mb-3"
    placeholder="Confirm password"
    bind:value={confirmPassword}
  />

  <button
    class="w-full p-3 bg-green-600 text-white rounded"
    on:click={updatePassword}
    disabled = {loading}
  >
    {loading? "Updating....":"Update Password"}
  </button>

  {#if message}
    <p class="text-green-600 mt-4">{message}</p>
  {/if}

  {#if error}
    <p class="text-red-600 mt-4">{error}</p>
  {/if}
</div>
