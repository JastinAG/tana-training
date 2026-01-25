import { test, expect } from '@playwright/test';
import { createBoard, createList, createCard, deleteBoard, getCard } from '../src/utils/trelloApi';
import { buildBoardPayload, buildListPayload } from '../src/data/trelloFactory';
import nastyStringsData from '../src/data/nastyStrings.json';

// Type assertion for the JSON data
const nastyStrings = nastyStringsData as Array<{ name: string; value: string }>;

/**
 * Parameterized Test: Validate Trello Card Name Field Against Nasty Strings
 * 
 * This test validates that Trello's card name field can handle various edge cases
 * including emojis, RTL languages, SQL injection attempts, HTML tags, and extreme values.
 * 
 * Uses Playwright's test.each() for parameterization to run the same test logic
 * for each of the 20 test cases defined in nastyStrings.json
 */
test.describe('Nasty Strings Validation - Card Name Field', () => {
  let boardId: string | null = null;
  let listId: string | null = null;

  test.beforeAll(async () => {
    // Setup: Create a board and list once for all tests
    const boardPayload = buildBoardPayload();
    const board = await createBoard(
      boardPayload.name,
      boardPayload.defaultLists,
      'public' // Public board for testing
    );
    boardId = board.id;

    const listPayload = buildListPayload();
    const list = await createList(board.id, listPayload.name);
    listId = list.id;
  });

  test.afterAll(async () => {
    // Cleanup: Delete the board after all tests
    if (boardId) {
      try {
        await deleteBoard(boardId);
        console.log(`Cleaned up board: ${boardId}`);
      } catch (error) {
        console.error(`Failed to cleanup board ${boardId}:`, error);
      }
    }
  });

  // Parameterized test using for...of loop
  // This will create 20 individual test cases, one for each nasty string
  for (const testCase of nastyStrings) {
    const { name, value } = testCase;
    
    test(`Should handle nasty string: ${name}`, async () => {
      // Handle max characters case - generate the long string dynamically
      let testValue = value;
      if (value === 'MAX_CHARS_PLACEHOLDER') {
        testValue = 'A'.repeat(1000); // Use 1000 chars instead of 16384 for practical testing
      }
      
      console.log(`\n[Test: ${name}] Testing with value: ${testValue.substring(0, 50)}${testValue.length > 50 ? '...' : ''}`);
      
      // Step 1: Create a card with the nasty string as the name
      const card = await createCard(listId!, testValue);
      
      console.log(`✓ Card created with ID: ${card.id}`);
      expect(card).toBeDefined();
      expect(card.id).toBeTruthy();
      
      // Step 2: Verify the card was created successfully
      expect(card.name).toBe(testValue);
      console.log(`✓ Card name matches input: ${testValue.substring(0, 30)}${testValue.length > 30 ? '...' : ''}`);
      
      // Step 3: Fetch the card via API to verify it persists correctly
      const fetchedCard = await getCard(card.id);
      expect(fetchedCard).toBeDefined();
      expect(fetchedCard.id).toBe(card.id);
      expect(fetchedCard.name).toBe(testValue);
      console.log(`✓ Card verified via API GET request`);
      
      // Step 4: Additional validation - check card name length
      if (testValue.length > 0) {
        expect(fetchedCard.name.length).toBeGreaterThan(0);
      }
      
      console.log(`✅ Test PASSED for: ${name}`);
    });
  }
});
