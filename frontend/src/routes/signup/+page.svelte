<script lang="ts">
  import { goto } from '$app/navigation';

  let name = '';
  let email = '';
  let password = '';

  let loading = false;
  let message = '';
  let isError = false;

  let showRules = false;
  let showEmailRules = false;
  let showPassword = false;

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  /*Email validation*/

  $:emailRules = {
    notEmpty : email.trim().length > 0,
    validFormat:validateEmail(email),
    noSpaces: !/\s/.test(email)
  };

  function validateEmail(email:string){
    const trimmed = email.trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return emailRegex.test(trimmed);
  }

  /*Email suggestion*/
  $:suggestion ="";
  if(email.endsWith('@gmail.com')){
    suggestion = "Did you mean gmail.com"
  }

  /*Live Password Rules*/
  $: rules = {
     length:password.length>=8,
     uppercase: /[A-Z]/.test(password),
     lowercase: /[a-z]/.test(password),
     number: /[0-9]/.test(password),
     special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  function validatePassword(){
    return Object.values(rules).every(Boolean);
  }

  async function handleSignup() {
    loading = true;
    message = '';
    isError = false;

    if (!navigator.onLine) {
      message = '❌ No internet connection.';
      isError = true;
      loading = false;
      return;
    }

    if(!validateEmail(email)){
      message = '❌Please enter a avalid email.';
      isError = true;
      loading = false;
      return;
    }


    if(!validatePassword()){
      message = '❌Please fix password reuirements.';
      isError = true;
      loading = false;
      return;
    }

    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email:email.trim().toLowerCase(), password })
      });

      const data = await res.json();

      if (!res.ok) {
        message = data?.message || '❌ Signup failed.';
        isError = true;
        return;
      }

      message ='✅Account created! Redirecting....';
      isError = false;

      setTimeout(() => {
        goto('/signin');
      }, 2000);

    } catch(err) {
      console.error(err);
      message = '❌ Server error.Please try again.';
      isError = true;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-md mx-auto mt-20 p-6 rounded-2xl shadow-xl bg-white">
  <h1 class="text-3xl font-bold mb-6 text-center">Create Account</h1>

  <div class="space-y-4">
    <input class="w-full p-3 border rounded-lg" placeholder="Full Name" bind:value={name} />

   <div> 
    <input class="w-full p-3 border rounded-lg" placeholder="Email" type="email" bind:value={email} on:focus={() => showEmailRules = true}/>
   
    {#if showEmailRules}
     <ul class = "text-sm mt-2 space-y-1">

      <li class ={emailRules.notEmpty ? "text-blue-600":"text-red-500"}>
        {emailRules.notEmpty ? "✅":"❌"} Email is required
      </li>

      <li class ={emailRules.noSpaces ? "text-blue-600":"text-red-500"}>
        {emailRules.noSpaces ? "✅":"❌"} No spaces allowed
      </li>

     </ul>
    {/if}

    {#if suggestion}
      <p class="text-yellow-600 text-sm mt-1">{suggestion}</p>
    {/if} 
  </div>   
    
  <div class="relative">
    <input class="w-full p-3 border rounded-lg pr-12" placeholder="Password" type={showPassword ? "text": "password"} bind:value={password} 
          on:focus={()=>showRules = true}/>

  <!--👁️ Toggle--> 
  <button
    type = "button"
    class = "absolute right-3 top-1/2 transform-translate-y-1/2 text-gray-500"
    on:click={() => showPassword = !showPassword}
  >
    {#if showPassword}
      🙈
    {:else}
      👁️
    {/if}
  </button>
</div>        

  <!-- Live Password Feedback-->
   {#if showRules}
     <ul class="text-sm mt-2 space-y-1">
      <li class={rules.length ? "text-blue-600":"text-red-500"}>
        {rules.length ? "✅":"❌"} Minimum 8 characters
      </li>

      <li class={rules.uppercase ? "text-blue-600":"text-red-500"}>
        {rules.uppercase ? "✅":"❌"} One uppercase letter
      </li>

      <li class={rules.lowercase ? "text-blue-600":"text-red-500"}>
        {rules.lowercase ? "✅":"❌"} One lowercase letter
      </li>

      <li class={rules.number ? "text-blue-600":"text-red-500"}>
        {rules.number ? "✅":"❌"} One number
      </li>

      <li class={rules.special ? "text-blue-600":"text-red-500"}>
        {rules.special ? "✅":"❌"} One special character
      </li>
     </ul>

     <!-- Strength Bar-->
      <div class="h-2 bg-gray-200 rounded mt-2">
        <div
          class="h-2 rounded transition-all bg-blue-500"
          style="width:{Object.values(rules).filter(Boolean).length*20}%">
        </div>
      </div>
    {/if}


    <!--Submit-->
    <button
      class="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      on:click={handleSignup}
      disabled={loading}
    >
      {loading ? 'Creating account...' : 'Sign Up'}
    </button>


    {#if message}
      <p class="text-center mt-3 {isError ? 'text-red-600':'text-green-600'}">
        {message}
      </p>
    {/if}

   </div>
</div>
