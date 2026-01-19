//Problem Javascript is single threaded
/**Blocking code is code that stops (blocks) the execution of everything else until it finishes. JavaScript runs on a single thread, meaning it can only do one thing at a time. */

/**Async callbacks let JavaScript say "start this task, but don't wait for it - I'll call you back when it's done." This keeps the program responsive.. */

console.log('Start');

setTimeout(() => {
	console.log('This runs after 2 seconds');
}, 2000);

console.log('End');

//If we were simulating a real world use case
console.log('Make an API CAll');

setTimeout(() => {
	console.log('Getting data from an endpoint');
}, 5000);

console.log('Doing other things');
//===========================================================
/**JavaScript evolved to make async code cleaner: */
function getData() {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ name: 'Alice', age: 25 });
		}, 2000);
	});
}

getData()
	.then((data) => console.log(data))
	.catch((error) => console.log(error));
//===========================================================
/**ANd finally to Async/Await */
async function fetchUser() {
	const data = await getData(); // Waits without blocking
	console.log(data);
}
