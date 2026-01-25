import { trelloConfig } from '../config/env';
import fetch from 'node-fetch';

export interface TrelloBoard {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
}

export interface TrelloList {
  id: string;
  name: string;
  idBoard: string;
}

export interface TrelloCard {
  id: string;
  name: string;
  idList: string;
  url: string;
  shortUrl: string;
}

const buildAuthParams = () => 
  `key=${encodeURIComponent(trelloConfig.apiKey)}&token=${encodeURIComponent(trelloConfig.token)}`;

export async function createBoard(name: string, defaultLists: boolean = false, permissionLevel: string = 'private'): Promise<TrelloBoard> {
  const url = `https://api.trello.com/1/boards/?${buildAuthParams()}&${new URLSearchParams({
    name,
    defaultLists: defaultLists.toString(),
    prefs_permissionLevel: permissionLevel,
  }).toString()}`;

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

  return await res.json() as TrelloBoard;
}

export async function createList(boardId: string, name: string): Promise<TrelloList> {
  const url = `https://api.trello.com/1/lists?${buildAuthParams()}&${new URLSearchParams({
    name,
    idBoard: boardId,
  }).toString()}`;

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

  return await res.json() as TrelloList;
}

export async function createCard(listId: string, name: string): Promise<TrelloCard> {
  const url = `https://api.trello.com/1/cards?${buildAuthParams()}&${new URLSearchParams({
    name,
    idList: listId,
  }).toString()}`;

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

  return await res.json() as TrelloCard;
}

export async function deleteBoard(boardId: string): Promise<void> {
  const url = `https://api.trello.com/1/boards/${boardId}?${buildAuthParams()}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }
}

export async function getBoard(boardId: string): Promise<TrelloBoard> {
  const url = `https://api.trello.com/1/boards/${boardId}?${buildAuthParams()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }

  return await res.json() as TrelloBoard;
}

export async function getList(listId: string): Promise<TrelloList> {
  const url = `https://api.trello.com/1/lists/${listId}?${buildAuthParams()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }

  return await res.json() as TrelloList;
}

export async function getCard(cardId: string): Promise<TrelloCard> {
  const url = `https://api.trello.com/1/cards/${cardId}?${buildAuthParams()}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Trello API error ${res.status}: ${text}`);
  }

  return await res.json() as TrelloCard;
}
