<script context='module'>
	export function preload({ params, query }) {
		return this.fetch(`index.json`)
			.then(r => r.json())
			.then(logs => {
				logs = logs.filter(log => !log.billed)
				return { logs }
			})
	}
</script>

<script>
	export let logs;
	import { dateString } from '../helpers/datestring'

	let dates = logs.length != 0 && logs.map(log => new Date(log.timestamp)).sort();

	let date1 = dates && dates[0];
	let date2 = dates && dates[dates.length - 1];
	let date = dates && `${dateString(date1)} - ${dateString(date2)}`

	let total = logs && logs.reduce((acc, curr) => acc + (curr.hours * curr.rate), 0)

	let accent = '#E94560'
	let separation = '16pt'
	let secondary = '#0F3460'

</script>

<style>
	* {
		color: #1A1A2E;
	}

	h3 {
		font-size: 1rem;
	}
</style>

<head>
	<title>Invoice - {date || dateString(new Date())}</title>
</head>

<div style='display:flex; align-items:center; justify-content:space-between; height:64pt;'>
	<div>
		<h1 style='font-weight:bold; color: {secondary}'>Tax Invoice</h1>
		<p style='color: {accent}; text-transform: capitalize;'>{date || dateString(new Date())}</p>
	</div>
	<div>
		<img src='logo.svg' alt='logo' style='height:64pt'>
	</div>
</div>

<div style='display:flex; align-items:center; justify-content:space-between; margin-top:{separation};'>
	<div>
		<p>Henry Jian Chen</p>
		<p>ABN: 55 786 383 734</p>
	</div>
	<div style='text-align:right;'>
		<p>114 Walderton Avenue</p>
		<p>Balga, WA, 6061</p>
	</div>
</div>

<div style='margin-top:{separation};'>
	<h3 style='font-weight:bold; color: {secondary};'>Billed To</h3>
	<p>MasterTheBooks PTY LTD</p>
	<p>WA 6026</p>
</div>

<div style='display:grid; grid-template-columns:3fr 1fr 1fr 1fr; margin-top:{separation};'>
	<p style='font-weight:bold; color: {secondary};'>Description of Supply</p>
	<p style='font-weight:bold; text-align:right; color: {secondary};'>Hour(s)</p>
	<p style='font-weight:bold; text-align:right; color: {secondary};'>Rate($/hr)</p>
	<p style='font-weight:bold; text-align:right; color: {secondary};'>Total</p>

	{#if logs.length != 0}

	{#each logs as entry}
	<p>{entry.description}</p>
	<p style='text-align:right;'>{entry.hours.toFixed(3)}</p>
	<p style='text-align:right;'>${entry.rate.toFixed(2)}</p>
	<p style='text-align:right;'>${(entry.rate * entry.hours).toFixed(2)}</p>
	{/each}

	{:else}

	<p style='grid-column: span 5; text-align:center'>There are no billables right now</p>
	{/if}

	<p style='font-weight:bold; grid-column: span 3; text-align:right; color: {accent};'>Total Amount Payable (Incl. GST)</p>
	<p style='font-weight:bold; text-align:right; color: {accent};'>${total.toFixed(2)}</p>
</div>

<div style='text-align:center; margin-top:{separation};'>
	<h3 style='margin-top:32pt; font-weight:bold; color: {secondary};'>Please Make Payment To:</h3>
	<p>Name: Henry Chen</p>
	<p>BSB: 066-192</p>
	<p>ACC: 1060 2535</p>
</div>

<div style='text-align:center; margin-top:{separation};'>
	<h3 style='font-weight:bold; color: {secondary};'>Thankyou 🙏</h3>
	<p style='width:150pt; margin:0 auto;'>Its been a pleasure working with you so far...</p>
</div>