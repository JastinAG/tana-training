class ShoppingCart {
	constructor() {
		this.items = [];
	}

	async scanItem(id) {
		console.log(`Scanning item: ${id}...`);

		return new Promise((resolve) => {
			setTimeout(() => {
				this.items.push(id);
				console.log(`Item ${id} added. Cart now has ${this.items.length} item(s).`);
				resolve();
			}, 2000);
		});
	}
}
async function processItems() {
	const cart = new ShoppingCart();
	const itemIds = [101, 102, 103];

	const startTime = Date.now();
	setTimeout(() => {});

	for (const id of itemIds) {
		await cart.scanItem(id);
	}
	//ForEach hai await

	const endTime = Date.now();
	const totalTime = (endTime - startTime) / 1000;

	console.log(`Total execution time: ${totalTime.toFixed(2)} seconds`);
}

processItems();
