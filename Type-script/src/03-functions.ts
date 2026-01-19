function add(a: number, b: number): number {
	return a + b;
}
console.log(`Sum: ${add(5, 10)}`);

function greet(name: string = 'Guest'): string {
	return `Hello, ${name}!`;
}
console.log(greet());
console.log(greet('Alice'));
