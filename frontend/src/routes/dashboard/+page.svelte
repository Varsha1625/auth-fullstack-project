<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Chart from 'chart.js/auto';

  type Attempt = {
    user_id?: string;
    attempted_at: string;
  };

  type Stat = {
    hour: string;
    count: number;
  };

  let attempts: Attempt[] = [];
  let stats: Stat[] = [];
  let loading = true;
  let error = '';

  let canvas: HTMLCanvasElement;
  let chart: Chart;

  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      goto('/login');
      return;
    }

    try {
      // ----------------------------
      // Fetch login attempts
      // ----------------------------
      const attemptsRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/dashboard/attempts`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!attemptsRes.ok) throw new Error('Attempts fetch failed');
      attempts = await attemptsRes.json();

      // ----------------------------
      // Fetch sign-ins per hour
      // ----------------------------
      const statsRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/dashboard/signins-hourly`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!statsRes.ok) throw new Error('Stats fetch failed');
      stats = await statsRes.json();

      console.log('📊 Hourly stats:', stats);

    } catch (err) {
      console.error(err);
      error = 'Failed to load dashboard';
    } finally {
      loading = false;
    }
  });

  // ----------------------------
  // Create / update chart
  // ----------------------------
  $: if (canvas && stats.length > 0) {
    chart?.destroy();

    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: stats.map(s => s.hour),
        datasets: [
          {
            label: 'Sign-ins per hour',
            data: stats.map(s => s.count),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 }
          }
        }
      }
    });
  }
</script>

<style>
  .chart-container {
    width: 100%;
    max-width: 700px;
    height: 400px;
  }
</style>

<h1>Dashboard</h1>

{#if loading}
  <p>Loading dashboard...</p>
{:else if error}
  <p style="color:red">{error}</p>
{:else}

  <h2>Sign-ins per hour</h2>

  {#if stats.length === 0}
    <p>No sign-in data available.</p>
  {:else}
    <div class="chart-container">
      <canvas bind:this={canvas}></canvas>
    </div>
  {/if}

  <h2>Login Attempts</h2>

  <table border="1" cellpadding="6">
    <thead>
      <tr>
        <th>User ID</th>
        <th>Timestamp</th>
      </tr>
    </thead>
    <tbody>
      {#each attempts as a}
        <tr>
          <td>{a.user_id ?? '—'}</td>
          <td>{new Date(a.attempted_at).toLocaleString()}</td>
        </tr>
      {/each}
    </tbody>
  </table>

{/if}
