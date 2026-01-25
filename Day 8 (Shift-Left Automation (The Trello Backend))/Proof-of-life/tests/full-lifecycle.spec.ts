import { test, expect } from '@playwright/test';
import { createBoard, createList, createCard, deleteBoard, getBoard, getList, getCard, TrelloBoard, TrelloList, TrelloCard } from '../src/utils/trelloApi';
import { buildBoardPayload, buildListPayload, buildCardPayload } from '../src/data/trelloFactory';

test.describe('Full Lifecycle Automation - End-to-End API Test', () => {
  let board: TrelloBoard | null = null;
  let list: TrelloList | null = null;
  let card: TrelloCard | null = null;

  test.afterEach(async () => {
    // Cleanup: Delete the board if it was created
    if (board?.id) {
      try {
        await deleteBoard(board.id);
        console.log(`Cleaned up board: ${board.id}`);
      } catch (error) {
        console.error(`Failed to cleanup board ${board.id}:`, error);
      }
    }
  });

  test('Full Lifecycle: Create Board -> Add List -> Add Card', async () => {
    // Step 1: Create a Board
    const boardPayload = buildBoardPayload();
    console.log(`\n[Step 1] Creating board: ${boardPayload.name}`);
    
    board = await createBoard(
      boardPayload.name,
      boardPayload.defaultLists,
      boardPayload.prefs_permissionLevel
    );

    expect(board).toBeDefined();
    expect(board.id).toBeTruthy();
    expect(board.name).toBe(boardPayload.name);
    console.log(`✓ Board created successfully`);
    console.log(`  Board ID: ${board.id}`);
    console.log(`  Board URL: ${board.shortUrl}`);

    // Verify board exists by fetching it
    const fetchedBoard = await getBoard(board.id);
    expect(fetchedBoard.id).toBe(board.id);
    expect(fetchedBoard.name).toBe(boardPayload.name);
    console.log(`✓ Board verified via GET request`);

    // Step 2: Add a List to the Board
    const listPayload = buildListPayload();
    console.log(`\n[Step 2] Creating list: ${listPayload.name} in board ${board.id}`);
    
    list = await createList(board.id, listPayload.name);

    expect(list).toBeDefined();
    expect(list.id).toBeTruthy();
    expect(list.name).toBe(listPayload.name);
    expect(list.idBoard).toBe(board.id);
    console.log(`✓ List created successfully`);
    console.log(`  List ID: ${list.id}`);
    console.log(`  List Name: ${list.name}`);

    // Verify list exists by fetching it
    const fetchedList = await getList(list.id);
    expect(fetchedList.id).toBe(list.id);
    expect(fetchedList.name).toBe(listPayload.name);
    expect(fetchedList.idBoard).toBe(board.id);
    console.log(`✓ List verified via GET request`);

    // Step 3: Add a Card to the List
    const cardPayload = buildCardPayload();
    console.log(`\n[Step 3] Creating card: ${cardPayload.name} in list ${list.id}`);
    
    card = await createCard(list.id, cardPayload.name);

    expect(card).toBeDefined();
    expect(card.id).toBeTruthy();
    expect(card.name).toBe(cardPayload.name);
    expect(card.idList).toBe(list.id);
    console.log(`✓ Card created successfully`);
    console.log(`  Card ID: ${card.id}`);
    console.log(`  Card Name: ${card.name}`);
    console.log(`  Card URL: ${card.shortUrl}`);

    // Verify card exists by fetching it
    const fetchedCard = await getCard(card.id);
    expect(fetchedCard.id).toBe(card.id);
    expect(fetchedCard.name).toBe(cardPayload.name);
    expect(fetchedCard.idList).toBe(list.id);
    console.log(`✓ Card verified via GET request`);

    // Final verification: All entities are linked correctly
    console.log(`\n[Verification] Verifying full lifecycle relationships...`);
    expect(fetchedCard.idList).toBe(list.id);
    expect(fetchedList.idBoard).toBe(board.id);
    console.log(`✓ Full lifecycle verified: Board -> List -> Card`);
    console.log(`\n✅ End-to-End Test PASSED: Successfully created board, list, and card`);
  });
});
