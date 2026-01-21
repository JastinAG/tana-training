let anotherUser = {
	name: 'John Smith',
	address: {
		street: '456 Oak Ave',
		city: 'Los Angeles',
		country: 'USA',
	},
};
console.log(`Another user's street: ${anotherUser.address?.street}`);
console.log(`Another user's city: ${anotherUser.address?.city}`);
