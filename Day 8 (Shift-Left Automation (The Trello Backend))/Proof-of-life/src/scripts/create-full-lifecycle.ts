import { createBoard, createList, createCard, deleteBoard } from '../utils/trelloApi';
import { buildBoardPayload, buildListPayload, buildCardPayload } from '../data/trelloFactory';

async function createFullLifecycle() {
  let boardId: string | null = null;

  try {
    // Step 1: Create a Board
    const boardPayload = buildBoardPayload();
    console.log(`\n[Step 1] Creating board: ${boardPayload.name}`);
    
    const board = await createBoard(
      boardPayload.name,
      boardPayload.defaultLists,
      boardPayload.prefs_permissionLevel
    );

    boardId = board.id;
    console.log(`✓ Board created successfully!`);
    console.log(`  Board Name: ${board.name}`);
    console.log(`  Board ID: ${board.id}`);
    console.log(`  Board URL: ${board.shortUrl}`);

    // Step 2: Add a List to the Board
    const listPayload = buildListPayload();
    console.log(`\n[Step 2] Creating list: ${listPayload.name} in board ${board.id}`);
    
    const list = await createList(board.id, listPayload.name);

    console.log(`✓ List created successfully!`);
    console.log(`  List ID: ${list.id}`);
    console.log(`  List Name: ${list.name}`);

    // Step 3: Add a Card to the List
    const cardPayload = buildCardPayload();
    console.log(`\n[Step 3] Creating card: ${cardPayload.name} in list ${list.id}`);
    
    const card = await createCard(list.id, cardPayload.name);

    console.log(`✓ Card created successfully!`);
    console.log(`  Card ID: ${card.id}`);
    console.log(`  Card Name: ${card.name}`);
    console.log(`  Card URL: ${card.shortUrl}`);

    // Summary
    console.log(`\n✅ Full Lifecycle Completed Successfully!`);
    console.log(`\n📋 Summary:`);
    console.log(`  Board: ${board.name} (${board.shortUrl})`);
    console.log(`  List: ${list.name}`);
    console.log(`  Card: ${card.name} (${card.shortUrl})`);
    console.log(`\nView your board at: ${board.shortUrl}`);

  } catch (error) {
    console.error('\n❌ Error during full lifecycle creation:', error);
    
    // Cleanup on error
    if (boardId) {
      console.log(`\nCleaning up board ${boardId}...`);
      try {
        await deleteBoard(boardId);
        console.log(`✓ Board ${boardId} deleted`);
      } catch (cleanupError) {
        console.error(`Failed to cleanup board:`, cleanupError);
      }
    }
    
    process.exit(1);
  }
}

createFullLifecycle();
