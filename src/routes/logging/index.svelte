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
  console.log(logs.length)
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
      form_obj = {}
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
    console.log(id);
    let res = await fetch("logging.json", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: { _id: id }, delta: { billed: true } }),
    });
    if (res.status == 200) {
      logs = await (await fetch("logging.json")).json();
    }
  };
</script>

<div style='margin:16pt 0;'>
    <a href='.'>Return Home...</a>
</div>

<h3 style='margin-top:18pt'>Add New Task</h3>
<form
  style="display:grid; grid-template-columns: 1fr 1fr 1fr; margin-top:12pt;"
  on:submit|preventDefault={logSubmission}>
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
  <input type="submit" />
</form>
<br />

<h3 style='margin-top:18pt'>Current Billable Tasks</h3>
<div style="display:grid; grid-template-columns:1fr 3fr 1fr 1fr 1fr;">
  <p style="font-weight:bold">Execution Date</p>
  <p style="font-weight:bold">Description</p>
  <p style="font-weight:bold">Hours</p>
  <p style="font-weight:bold">Cost</p>
  <p style="font-weight:bold">Actions</p>

  {#if logs.length == 0}
  <p style='grid-column: span 5; text-align:center'>Time for more bread! 🍞</p>
  {:else}
    {#each logs as log}
        <p>{dateString(new Date(log.timestamp))}</p>
        <p>{log.description}</p>
        <p>{log.hours}</p>
        <p>{log.hours * log.rate}</p>
        <div style="display:flex; align-items:center">
        <button on:click={() => billLog(log._id)}>billed</button>
        <button on:click={() => deleteLog(log._id)}>delete</button>
        </div>
    {/each}
  {/if}

</div>