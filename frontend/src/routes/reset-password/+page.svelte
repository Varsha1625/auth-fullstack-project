<script lang="ts">
  //import { onMount } from "svelte";
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let password:string = '';
  let confirmPassword:string = '';
  let message:string = '';
  let error:string = '';
  let loading:boolean = false;

  let showPassword = false;
  let showConfirmPassword = false;

  //let sessionReady = false;

  /*onMount(async() => {
      const hash = window.location.hash;

    if(hash && hash.includes("access_token")){
      const params = new URLSearchParams(hash.substring(1));

      const access_token = params.get('access_token');
      const refresh_token = params.get('refresh_token');

         if(access_token && refresh_token){
          await supabase.auth.setSession({
            access_token,
            refresh_token
          });
        }
      }

         const {data,error} = await supabase.auth.getSession();

       if(data.session){
        //sessionReady = true;
        console.log("Session available");
       }else{
        console.log("No session");
       }
  });*/

  /*Live Password Rules*/
   $:length = password.length>=8;
   $:uppercase = /[A-Z]/.test(password);
   $:lowercase = /[a-z]/.test(password);
   $:number =/[0-9]/.test(password);
   $:special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

   $:validPassword = length && uppercase && lowercase && number && special ;

  async function updatePassword(){
    loading = true;
    message = '';
    error = '';
    
    try{
      
      if(!password ||!confirmPassword){
        error = "❌All fields are required";
        loading = false;
        return;
      }

      if(!validPassword){
        error = "❌ Passwords does not meet requirements";
        loading = false;
        return;
      }


      if(password !== confirmPassword){
        error = "Passwords do not match";
        loading = false;
        return;
      }

      const {data} = await supabase.auth.getSession();

        if(!data.session){
          error = "❌Session expired.Please request again";
          loading = false;
          return;
        }
  
    const{error: updateError} = await supabase.auth.updateUser({password:password});

    if(updateError){
      throw updateError;
    }

    message = 'Password updated successfully! Redirecting....';

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

<div class="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-xl">
  <h1 class="text-2xl font-bold mb-4 text-center">Reset Password</h1>


  <!--New Password-->
  <div class="relative mb-3">
   <input
    type={showPassword ? "text": "password"}
    class="w-full p-3 border rounded"
    placeholder="New password"
    bind:value={password}
   />

   <button
    type="button"
    class="absolute right-3 top-3 text-sm text-blue-600"
    on:click={() => showPassword = !showPassword}
   >
    {showPassword ? "Hide":"Show"}
   </button>
</div>

  <!--Confirm Password-->
  <div class="relative mb-3">
  <input
    type={showConfirmPassword ? "text":"password"}
    class="w-full p-3 border rounded"
    placeholder="Confirm password"
    bind:value={confirmPassword}
  />

  <button
    type="button"
    class="absolute right-3 top-3 text-sm text-blue-600"
    on:click={() => showConfirmPassword =! showConfirmPassword}
  >
    {showConfirmPassword ? "Hide":"Show"}
  </button>
  </div>

  <!--Password  Rules-->
  <div class="text-sm space-y-1 mb-4">
    <p class={length ? "text-green-600": "text-red-600"}>
       .Minimum 8 characters
    </p>

    <p class={uppercase ? "text-green-600": "text-red-600"}>
       .One uppercase letter
    </p>

    
    <p class={lowercase ? "text-green-600": "text-red-600"}>
       .One lowercase letter
    </p>
 
    <p class={number ? "text-green-600": "text-red-600"}>
       .One number
    </p>

    <p class={special ? "text-green-600": "text-red-600"}>
       .One special character
    </p>
  </div>

  <!--Button-->
  <button
    class="w-full p-3 bg-green-600 text-white rounded hover:bg-green-700"
    on:click={updatePassword}
    disabled ={loading}
    >
      {loading ?"Updating....":"Update Password"}
  </button>

  {#if message}
    <p class="text-green-600 mt-4 text-center">{message}</p>
  {/if}

  {#if error}
    <p class="text-red-600 mt-4 text-center">{error}</p>
  {/if}
</div>
