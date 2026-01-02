<h1 style="color:red; font-size:40px;">SIGNIN PAGE TEST</h1>
<script lang="ts">
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
</script>

<div style="max-width:400px;margin:100px auto;padding:20px;border:2px solid black;">
  <h1 style="font-size:30px;font-weight:bold;">Sign In</h1>

  <input
    placeholder="Email"
    bind:value={email}
    style="display:block;width:100%;margin-top:20px;padding:10px;border:1px solid black;"
  />

  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    style="display:block;width:100%;margin-top:10px;padding:10px;border:1px solid black;"
  />

  <!-- 🔴 THIS CANNOT BE HIDDEN -->
  <div style="margin-top:10px;">
    <a href="/forgot-password" style="color:blue;text-decoration:underline;">
      Forgot password?
    </a>
  </div>

  <button
    style="margin-top:20px;padding:10px;width:100%;background:black;color:white;"
  >
    Sign In
  </button>
</div>
