import { trelloConfig } from '../config/env';
import fetch from 'node-fetch';

async function main() {
	const url = `https://api.trello.com/1/members/me?key=${encodeURIComponent(
		trelloConfig.apiKey
	)}&token=${encodeURIComponent(trelloConfig.token)}`;

	const res = await fetch(url);
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Trello API error ${res.status}: ${text}`);
	}

	const data = (await res.json()) as { username?: string; fullName?: string };
	console.log(`Trello username: ${data.username ?? 'unknown'}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
