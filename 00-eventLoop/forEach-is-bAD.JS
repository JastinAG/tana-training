const bugIds = [101, 102, 103];

async function fetchBug(id) {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log(`Fetched bug ${id}`);
			resolve(id);
		}, 1000);
	});
}

async function processBugs() {
	bugIds.forEach(async (id) => {
		await fetchBug(id);
	});

	console.log('All bugs processed');
}

processBugs();
//EXPECTED : Fetch bug details asynchronously and then log "All bugs processed" AFTER everything finishes.
// PROBLEM: In the output "All bugs processed" runs before the async work finishes.
