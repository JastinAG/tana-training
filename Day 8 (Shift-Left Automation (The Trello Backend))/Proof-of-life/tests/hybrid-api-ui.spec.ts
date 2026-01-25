import { test, expect } from '@playwright/test';
import { createBoard, createList, deleteBoard } from '../src/utils/trelloApi';
import { buildBoardPayload, buildListPayload } from '../src/data/trelloFactory';
import { TrelloBoardPage } from '../src/pages/TrelloBoardPage';

/**
 * Hybrid Test: API Setup + UI Validation
 * 
 * This test demonstrates the hybrid testing approach:
 * 1. Uses API to create a Board and a List (fast, reliable setup)
 * 2. Uses Playwright UI automation to navigate to the board
 * 3. Verifies the List is visible on the screen (validates UI rendering)
 */
test.describe('Hybrid Test: API Setup + UI Validation', () => {
  let boardId: string | null = null;

  test.afterEach(async () => {
    // Cleanup: Delete the board if it was created
    if (boardId) {
      try {
        await deleteBoard(boardId);
        console.log(`Cleaned up board: ${boardId}`);
      } catch (error) {
        console.error(`Failed to cleanup board ${boardId}:`, error);
      }
    }
  });

  test('Create Board and List via API, then verify List is visible in UI', async ({ page }) => {
    // ============================================
    // STEP 1: API Setup - Create Board and List
    // ============================================
    console.log('\n[API Setup] Creating board and list via Trello API...');
    
    const boardPayload = buildBoardPayload();
    const listPayload = buildListPayload();

    // Create board via API
    // Note: Using 'public' permission for UI testing so the board is accessible without authentication.
    // This allows the UI validation to work without requiring browser authentication setup.
    // The API-only test (full-lifecycle.spec.ts) uses 'private' as per requirement GR-501.
    const board = await createBoard(
      boardPayload.name,
      boardPayload.defaultLists,
      'public' // Public board for UI validation (no auth required)
    );

    boardId = board.id;
    console.log(`✓ Board created via API: ${board.name} (${board.shortUrl})`);

    // Create list via API
    const list = await createList(board.id, listPayload.name);
    console.log(`✓ List created via API: ${list.name}`);

    // ============================================
    // STEP 2: UI Navigation - Navigate to Board
    // ============================================
    console.log('\n[UI Navigation] Navigating to board URL...');
    
    const boardPage = new TrelloBoardPage(page);
    
    // Navigate to the board using the short URL
    await boardPage.goto(board.shortUrl);
    console.log(`✓ Navigated to board: ${board.shortUrl}`);
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/board-page.png', fullPage: true });
    console.log('Screenshot saved to test-results/board-page.png');

    // ============================================
    // STEP 3: UI Validation - Verify List is Visible
    // ============================================
    console.log(`\n[UI Validation] Verifying list "${listPayload.name}" is visible...`);
    
    // Verify the list is visible on the page
    await boardPage.verifyListIsVisible(listPayload.name);
    console.log(`✓ List "${listPayload.name}" is visible on the board`);

    // Additional verification: Get board name from UI
    const uiBoardName = await boardPage.getBoardName();
    expect(uiBoardName).toContain(boardPayload.name);
    console.log(`✓ Board name verified in UI: ${uiBoardName}`);

    // Additional verification: Get all lists and verify our list is present
    const allLists = await boardPage.getAllListNames();
    expect(allLists).toContain(listPayload.name);
    console.log(`✓ List found in all visible lists: ${allLists.join(', ')}`);

    // Final assertion
    const listExists = await boardPage.listExists(listPayload.name);
    expect(listExists).toBe(true);

    console.log('\n✅ Hybrid Test PASSED: API-created list is visible in UI');
  });
});
