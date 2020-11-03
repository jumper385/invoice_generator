<script>
import { dateString } from "../helpers/datestring";
export let entry_array;
export let billLog, deleteLog, stashLog;
</script>


<style>
	.table_heading {
		font-weight:bold
	}
</style>

<div style="display:grid; grid-template-columns:1fr 3fr 1fr 1fr 1fr;">
	<p class='table_heading'>Execution Date</p>
	<p class='table_heading'>Description</p>
	<p class='table_heading'>Hours</p>
	<p class='table_heading'>Cost</p>
	<p class='table_heading'>Actions</p>

	{#if entry_array.length == 0}
		<p style="grid-column: span 5; text-align:center">
			Time for more bread! 🍞
		</p>
	{:else}
		{#each entry_array as log}
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
