<script context="module">
  export function preload({ params, quer }) {
    return this.fetch("logging.json")
      .then((r) => r.json())
      .then((logs) => {
        return { logs };
      });
  }
</script>

<script>
  export let logs;
  $: completed = logs.filter((x) => x.billed || x.stashed).slice(-6,-1);
  $: incomplete = logs.filter((x) => !x.billed * !x.stashed);

  import { dateString } from "../../helpers/datestring";

  let form_obj = {};
  const logSubmission = async () => {
    let res = await fetch("logging.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form_obj),
    });

    if (res.status == 200) {
      logs = await (await fetch("logging.json")).json();
      form_obj = {};
    }
  };

  const deleteLog = async (id) => {
    console.log(id);
    let res = await fetch("logging.json", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });
    if (res.status == 200) {
      logs = await (await fetch("logging.json")).json();
    }
  };

  const billLog = async (id) => {
    let res = await fetch("logging.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { _id: id },
        delta: { billed: true, stashed: false },
      }),
    });
    if (res.status == 200) {
      logs = await (await fetch("logging.json")).json();
    }
  };

  const stashLog = async (id) => {
    let res = await fetch("logging.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: { _id: id },
        delta: { stashed: true, billed: false },
      }),
    });
    if (res.status == 200) {
      logs = await (await fetch("logging.json")).json();
    }
  };
</script>

<style>
  h3 {
    text-align: center;
    margin-bottom: 12pt;
    font-weight: bold;
  }
  form {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-top: 12pt;
    grid-column-gap: 24pt;
  }
  .input_field {
    display: grid;
    grid-template-rows: 1fr1 1.5fr;
  }

  .input_field label {
    margin-bottom: 3pt;
    font-size:0.75rem;
    padding-left: 6pt;
    text-transform: uppercase;
    font-weight:bold;
    color:rgba(0,0,0,.24);
  }

  .input_field input {
    width: 100%;
    margin-bottom:12pt;
    display:flex;
    align-items: center;
    padding:6pt;
    border-radius:2pt;
    box-sizing:border-box;
    border: rgba(0,0,0,.24) solid 1px;
  }

  @media only screen and (max-width:800px) {
    form {
      display:flex !important;
      flex-direction: column;
    }
  }
</style>

<div style="margin:16pt 0;"><a href=".">Return Home...</a></div>

<h3 style="margin-top:18pt">Add New Task</h3>
<form on:submit|preventDefault={logSubmission} style='margin:0; width:100%; box-sizing:border-box;'>
  <div class="input_field">
    <label for="description">Task Description</label>
    <input
      bind:value={form_obj.description}
      type="text"
      name="description"
      id="description" />
  </div>
  <div class="input_field">
    <label for="description">Hours</label>
    <input
      bind:value={form_obj.hours}
      type="number"
      step="0.01"
      name="hours"
      id="hours" />
  </div>
  <input type="submit" disabled={!form_obj.hours}/>
</form>
<br />

<h3 style="margin-top:18pt">Current Billable Tasks</h3>
<div style="display:grid; grid-template-columns:1fr 3fr 1fr 1fr 1fr;">
  <p style="font-weight:bold">Execution Date</p>
  <p style="font-weight:bold">Description</p>
  <p style="font-weight:bold">Hours</p>
  <p style="font-weight:bold">Cost</p>
  <p style="font-weight:bold">Actions</p>

  {#if incomplete.length == 0}
    <p style="grid-column: span 5; text-align:center">
      Time for more bread! 🍞
    </p>
  {:else}
    {#each incomplete as log}
      <p>{dateString(new Date(log.timestamp))}</p>
      <p>{log.description}</p>
      <p>{log.hours.toFixed(3)}</p>
      <p>${(log.hours * log.rate).toFixed(2)}</p>
      <div style="display:flex; align-items:center">
        <button
          on:click={() => billLog(log._id)}
          disabled={log.billed}>bill</button>
        <button
          on:click={() => deleteLog(log._id)}
          disabled={log.billed}>delete</button>
        <button
          on:click={() => stashLog(log._id)}
          disabled={log.billed || log.stashed}>stash</button>
      </div>
    {/each}
  {/if}
</div>

<h3 style="margin-top:18pt">Recently Finalized Tasks</h3>
<div style="display:grid; grid-template-columns:1fr 3fr 1fr 1fr 1fr;">
  <p style="font-weight:bold">Execution Date</p>
  <p style="font-weight:bold">Description</p>
  <p style="font-weight:bold">Hours</p>
  <p style="font-weight:bold">Cost</p>
  <p style="font-weight:bold">Actions</p>

  {#if logs.length == 0}
    <p style="grid-column: span 5; text-align:center">
      Time for more bread! 🍞
    </p>
  {:else}
    {#each completed as log}
      <p>{dateString(new Date(log.timestamp))}</p>
      <p>{log.description}</p>
      <p>{log.hours.toFixed(3)}</p>
      <p>${(log.hours * log.rate).toFixed(2)}</p>
      <div style="display:flex; align-items:center">
        <button
          on:click={() => billLog(log._id)}
          disabled={log.billed}>bill</button>
        <button
          on:click={() => deleteLog(log._id)}
          disabled={log.billed}>delete</button>
        <button
          on:click={() => stashLog(log._id)}
          disabled={log.billed || log.stashed}>stash</button>
      </div>
    {/each}
  {/if}
</div>
