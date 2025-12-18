<script lang="ts">
  import axios from 'axios';
  import { onMount } from 'svelte';

  // Define a type for your login data
  type Login = {
    email: string;
    timestamp: string;
  };

  // Explicitly type your variable
  let logins: Login[] = [];

  onMount(async () => {
    try {
      const res = await axios.get<Login[]>(
        `${import.meta.env.VITE_API_URL}/dashboard/logins`
      );
      logins = res.data;
    } catch (e) {
      console.error(e);
      alert('Unable to fetch login attempts');
    }
  });
</script>

<div class="p-8">
  <h1 class="text-3xl font-bold mb-6">Dashboard - Login Attempts</h1>

  {#if logins.length === 0}
    <p class="text-gray-500">No login attempts found.</p>
  {:else}
    <table class="table-auto w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2 border">Email</th>
          <th class="p-2 border">Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {#each logins as login}
          <tr>
            <td class="p-2 border">{login.email}</td>
            <td class="p-2 border">{login.timestamp}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</div>
