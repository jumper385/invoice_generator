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
  import EntryDisplay from "../../components/EntryDisplay.svelte";
  let form_obj = {};

  $: completed = logs
    .filter((x) => x.billed || x.stashed)
    .slice(-6, -1)
    .sort((e1, e2) => new Date(e2.timestamp) - new Date(e1.timestamp));

  $: incomplete = logs
    .filter((x) => !x.billed * !x.stashed)
    .sort((e1, e2) => new Date(e2.timestamp) - new Date(e1.timestamp));

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
    let res = await fetch("logging.json", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: id }),
    });
    if (res.status == 200) logs = await (await fetch("logging.json")).json();
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
    if (res.status == 200) logs = await (await fetch("logging.json")).json();
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
    if (res.status == 200) logs = await (await fetch("logging.json")).json();
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
    font-size: 0.75rem;
    padding-left: 6pt;
    text-transform: uppercase;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.24);
  }

  .input_field input {
    width: 100%;
    margin-bottom: 12pt;
    display: flex;
    align-items: center;
    padding: 6pt;
    border-radius: 2pt;
    box-sizing: border-box;
    border: rgba(0, 0, 0, 0.24) solid 1px;
  }

  @media only screen and (max-width: 800px) {
    form {
      display: flex !important;
      flex-direction: column;
    }
  }
</style>

<div style="margin:16pt 0;"><a href=".">Return Home...</a></div>

<h3 style="margin-top:18pt">Add New Task</h3>
<form
  on:submit|preventDefault={logSubmission}
  style="margin:0; width:100%; box-sizing:border-box;">
  <div class="input_field">
    <label for="description">Task Description</label>
    <input
      bind:value={form_obj.description}
      type="text"
      name="description"
      id="description" />
  </div>
  <div class="input_field">
    <label for="hours">Hours</label>
    <input
      bind:value={form_obj.hours}
      type="number"
      step="0.001"
      min="0"
      name="hours"
      id="hours" />
  </div>
  <div class="input_field">
    <label for="timestamp">Timestamp</label>
    <input
      bind:value={form_obj.timestamp}
      type="date"
      name="timestamp"
      id="timestamp" />
  </div>
  <input
    type="submit"
    style="height:32pt;grid-column: span 3"
    disabled={form_obj.hours < 0} />
</form>
<br />

<h3 style="margin-top:18pt">Current Billable Tasks</h3>
<EntryDisplay entry_array={incomplete} {billLog} {deleteLog} {stashLog} />

<h3 style="margin-top:18pt">Recently Finalized Tasks</h3>
<EntryDisplay entry_array={completed} {billLog} {deleteLog} {stashLog} />
