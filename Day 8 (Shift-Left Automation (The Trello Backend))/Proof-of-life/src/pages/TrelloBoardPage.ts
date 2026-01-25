import { Page, Locator } from '@playwright/test';

export class TrelloBoardPage {
  readonly page: Page;
  
   private readonly boardHeader: Locator;
  private readonly listsContainer: Locator;
  private readonly listNameInput: Locator;

  constructor(page: Page) {
    this.page = page;

    this.boardHeader = page.locator('[data-testid="board-name-display"], .board-header-btn-text, h1').first();
    
    this.listsContainer = page.locator('.js-list-content, .list-wrapper, [data-testid="list"]');

    this.listNameInput = page.locator('.list-header-name, .list-header-name-assist, [data-testid="list-name"]');
  }

  /**
   * Navigate to a Trello board using its URL
   * @param boardUrl - The full URL or short URL of the board
   */
  async goto(boardUrl: string): Promise<void> {
    await this.page.goto(boardUrl);
    // Wait for the board to load - use 'domcontentloaded' instead of 'networkidle'
    // because Trello has continuous network activity
    await this.page.waitForLoadState('domcontentloaded');
    // Give the page a moment to render
    await this.page.waitForTimeout(2000);
    // Try to wait for board header, but don't fail if it's not found immediately
    // (user might need to log in first)
    try {
      await this.boardHeader.waitFor({ state: 'visible', timeout: 10000 });
    } catch {
      // If board header not found, wait for any board content
      await this.page.waitForSelector('.board, [data-testid="board"]', { timeout: 10000 });
    }
  }

  /**
   * Verify that a list with the given name is visible on the board
   * @param listName - The name of the list to verify
   */
  async verifyListIsVisible(listName: string): Promise<void> {
    // Wait a bit for the page to fully load
    await this.page.waitForTimeout(2000);
    
    // Try multiple strategies to find lists
    // Strategy 1: Try our primary selectors
    try {
      await this.listsContainer.first().waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      // Strategy 2: Look for any list-like elements
      const alternativeContainer = this.page.locator('.lists, .board-canvas, [class*="list"]').first();
      try {
        await alternativeContainer.waitFor({ state: 'visible', timeout: 5000 });
      } catch {
        // Strategy 3: Just look for the list name directly anywhere on the page
        console.log('Lists container not found, trying direct text search...');
      }
    }
    
    // Find the list by its name text using multiple selector strategies
    // Try multiple approaches to find the list name
    const listSelectors = [
      this.page.locator('.list-header-name', { hasText: listName }),
      this.page.locator('.list-header-name-assist', { hasText: listName }),
      this.page.locator('[data-testid="list-name"]', { hasText: listName }),
      this.page.getByText(listName, { exact: false }).first(),
      this.page.locator(`text=${listName}`).first(),
    ];

    let found = false;
    for (const selector of listSelectors) {
      try {
        await selector.waitFor({ state: 'visible', timeout: 5000 });
        found = true;
        break;
      } catch {
        // Try next selector
        continue;
      }
    }

    if (!found) {
      // Debug: Try to get page info before it closes
      let pageTitle = '';
      let pageUrl = '';
      
      try {
        // Wait a moment to ensure page is still accessible
        await this.page.waitForTimeout(1000);
        pageTitle = await this.page.title();
        pageUrl = this.page.url();
        console.log('Page title:', pageTitle);
        console.log('Page URL:', pageUrl);
        
        // Check if we're on a login page by checking URL or title
        if (pageUrl.includes('login') || pageUrl.includes('signin') || pageTitle.toLowerCase().includes('login') || pageTitle.toLowerCase().includes('sign in')) {
          throw new Error('Appears to be on login page. Authentication is required to view private boards. Please ensure you are logged into Trello in the browser context.');
        }
        
        // If we can get page info, the page is still open, so the list just wasn't found
        throw new Error(`List "${listName}" not found on the page. Current page: ${pageTitle} (${pageUrl}). The selectors may need updating or the list may not have loaded yet.`);
      } catch (error) {
        // If we can't get page info, the page may have closed
        if (error instanceof Error) {
          if (error.message.includes('closed') || error.message.includes('Target page')) {
            throw new Error(`Page closed unexpectedly while searching for list "${listName}". This may indicate an authentication issue, the board URL is invalid, or Trello redirected/closed the page. Last known URL: ${pageUrl || 'unknown'}`);
          }
          // Re-throw if it's our custom error
          if (error.message.includes('not found') || error.message.includes('login page')) {
            throw error;
          }
        }
        // For other errors, provide a generic message
        throw new Error(`Failed to verify list "${listName}" is visible. Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  /**
   * Get the board name from the page header
   */
  async getBoardName(): Promise<string> {
    return await this.boardHeader.textContent() || '';
  }

  /**
   * Get all visible list names on the board
   */
  async getAllListNames(): Promise<string[]> {
    await this.listsContainer.first().waitFor({ state: 'visible', timeout: 15000 });
    const listNames = await this.listNameInput.allTextContents();
    return listNames.filter(name => name.trim().length > 0);
  }

  /**
   * Check if a specific list exists on the board
   * @param listName - The name of the list to check
   */
  async listExists(listName: string): Promise<boolean> {
    try {
      const listLocator = this.page.locator(
        '.list-header-name, .list-header-name-assist, [data-testid="list-name"]',
        { hasText: listName }
      );
      await listLocator.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}
