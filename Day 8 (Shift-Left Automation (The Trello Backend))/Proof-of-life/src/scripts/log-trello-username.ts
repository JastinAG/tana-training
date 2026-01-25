import { trelloConfig } from '../config/env';
import fetch from 'node-fetch';

async function main() {
	const url = `https://api.trello.com/1/members/me?key=${encodeURIComponent(
		trelloConfig.apiKey
	)}&token=${encodeURIComponent(trelloConfig.token)}`;

	console.log('Fetching Trello user data...');
	
	const res = await fetch(url);
	
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Trello API error ${res.status}: ${text}`);
	}

	const data = (await res.json()) as { username?: string; fullName?: string; id?: string };
	
	console.log('Full API response:', JSON.stringify(data, null, 2));
	console.log(`Trello username: ${data.username ?? 'unknown'}`);
	if (data.fullName) {
		console.log(`Full name: ${data.fullName}`);
	}
}

main().catch((err) => {
	console.error('Error:', err);
	process.exit(1);
});