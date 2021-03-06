<script context="module">
	export function preload({ params, query }) {
		return this.fetch(`index.json`)
			.then((r) => r.json())
			.then((logs) => {
				return { logs };
			});
	}
</script>

<script>
	export let logs;
	import { dateString } from "../helpers/datestring";

	let dates =
		logs.length != 0 &&
		logs
			.filter((log) => !log.stashed && !log.billed)
			.map((log) => new Date(log.timestamp))
			.sort((d1, d2) => d1 - d2);

	let date =
		dates.length > 0
			? `From ${dateString(dates[0])} to ${dateString(
					dates[dates.length - 1]
			  )}`
			: "No billable dates";

	let reduced_logs = logs
		.filter((log) => !log.billed && !log.stashed)
		.sort((e1, e2) => new Date(e1.timestamp) - new Date(e2.timestamp))
		.reduce((acc, curr) => {
			curr.description in acc ||
				(acc[curr.description] = { hours: 0, rate: 30 });
			acc[curr.description] = {
				hours: acc[curr.description].hours + curr.hours,
				rate: curr.rate,
				dates:
					acc[curr.description].dates != undefined
						? [
								...acc[curr.description].dates,
								dateString(new Date(curr.timestamp)),
						  ]
						: [dateString(new Date(curr.timestamp))],
			};
			return acc;
		}, {});

	let total =
		logs &&
		logs.reduce((acc, curr) => {
			acc += curr.billed | curr.stashed ? 0 : curr.hours * curr.rate;
			return acc;
		}, 0);

	let accent = "#E94560";
	let separation = "8pt";
	let secondary = "#0F3460";
</script>

<style>
	* {
		color: #1a1a2e;
	}

	h3 {
		font-size: 1rem;
	}
</style>

<head>
	<title>Invoice DOI:{dateString(new Date())}</title>
</head>

<body style="font-size:0.75rem;">
	<div
		style="display:flex; align-items:center; justify-content:space-between; height:64pt">
		<div>
			<h1 style="font-weight:bold; color: {secondary}">Tax Invoice</h1>
			<p style="color: {accent};">{date || dateString(new Date())}</p>
			<p style="color: {accent}; text-transform: Capitalize">
				Date of Issue:
				{dateString(new Date())}
			</p>
		</div>
		<div><img src="logo.svg" alt="logo" style="height:64pt" /></div>
	</div>

	<div
		style="display:flex; align-items:center; justify-content:space-between; margin-top:{separation};">
		<div>
			<p>Henry Jian Chen</p>
			<p>ABN: 55 786 383 734</p>
		</div>
		<div style="text-align:right;">
			<p>114 Walderton Avenue</p>
			<p>Balga, WA, 6061</p>
		</div>
	</div>

	<div style="margin-top:{separation}">
		<h3 style="font-weight:bold; color: {secondary};">Billed To</h3>
		<p>MasterTheBooks PTY LTD</p>
		<p>WA 6026</p>
	</div>

	<div
		style="display:grid; grid-template-columns:3fr 1fr 1fr 1fr; margin-top:{separation}">
		<p style="font-weight:bold; color: {secondary};">
			Description of Supply
		</p>
		<p style="font-weight:bold; text-align:right; color: {secondary};">
			Hour(s)
		</p>
		<p style="font-weight:bold; text-align:right; color: {secondary};">
			Rate($/hr)
		</p>
		<p style="font-weight:bold; text-align:right; color: {secondary};">
			Total
		</p>

		{#if logs.length != 0}
			{#each Object.keys(reduced_logs) as entry}
				<p style="margin-top:3pt;">
					<span>{entry}</span>
					<br />
					<span
						style="padding-top:12pt; font-size:0.65rem; padding-left:12pt;">{reduced_logs[entry].dates}</span>
				</p>

				<p style="text-align:right;">
					{reduced_logs[entry].hours.toFixed(3)}
				</p>
				<p style="text-align:right;">
					${reduced_logs[entry].rate.toFixed(2)}
				</p>
				<p style="text-align:right;">
					${(reduced_logs[entry].rate * reduced_logs[entry].hours).toFixed(2)}
				</p>
			{/each}
		{:else}
			<p style="grid-column: span 5; text-align:center">
				There are no billables right now
			</p>
		{/if}

		<p
			style="font-weight:bold; grid-column: span 3; text-align:right; color: {accent};">
			Total Amount Payable (Not Including GST)
		</p>
		<p style="font-weight:bold; text-align:right; color: {accent};">
			${total.toFixed(2)}
		</p>
	</div>

	<div style="text-align:center; margin-top:{separation}">
		<h3 style="margin-top:32pt; font-weight:bold; color: {secondary};">
			Please Make Payment To:
		</h3>
		<p>Name: Henry Chen</p>
		<p>BSB: 066-192</p>
		<p>ACC: 1060 2535</p>
	</div>
</body>
