class BugReport {
	constructor(title, severity, status) {
		this.title = title;
		this.severity = severity;
		this.status = status;
	}

	closeBug() {
		this.status = 'Closed';
		console.log(`Bug "${this.title}" has been closed.`);
	}
}
const loginBug = new BugReport('Login button not responding', 'High', 'Open');
loginBug.closeBug();
