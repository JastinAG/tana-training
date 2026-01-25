import { trelloConfig } from '../config/env';
import { buildBoardPayload } from '../data/trelloFactory';
import fetch from 'node-fetch';

async function createBoard() {
  const payload = buildBoardPayload();
  const url = `https://api.trello.com/1/boards/?key=${encodeURIComponent(
    trelloConfig.apiKey
  )}&token=${encodeURIComponent(trelloConfig.token)}&${new URLSearchParams({
    name: payload.name,
    defaultLists: payload.defaultLists.toString(),
    prefs_permissionLevel: payload.prefs_permissionLevel,
  }).toString()}`;

  console.log(`Creating board with unique name: ${payload.name}`);
  console.log('Sending request to Trello API...');

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }

  const board = await res.json();
  console.log('\nBoard created successfully!');
  console.log(`Board Name: ${board.name}`);
  console.log(`Board ID: ${board.id}`);
  console.log(`Board URL: ${board.url}`);
  console.log(`\nView your board at: ${board.shortUrl}`);
}

createBoard().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});