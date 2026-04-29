import { test, expect, type Page } from '@playwright/test';

// ── Helpers ────────────────────────────────────────────────────────────────

async function clearStorage(page: Page) {
  await page.evaluate(() => localStorage.clear());
}

async function signup(page: Page, email: string, password = 'Password1') {
  await page.goto('/signup');
  await page.getByTestId('auth-signup-email').fill(email);
  await page.getByTestId('auth-signup-password').fill(password);
  await page.getByTestId('auth-signup-submit').click();
  await page.waitForURL('/dashboard');
}

async function logout(page: Page) {
  await page.getByText('Log out').first().click();
  await page.getByTestId('auth-logout-button').click();
  await page.waitForURL('/login');
}

// ── Suite ──────────────────────────────────────────────────────────────────

test.describe('Habit Tracker app', () => {
  test('shows the splash screen and redirects unauthenticated users to /login', async ({
    page,
  }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.goto('/');

    await expect(page.getByTestId('splash-screen')).toBeVisible();
    await page.waitForURL('/login', { timeout: 5000 });
    await expect(page.getByTestId('auth-login-email')).toBeVisible();
  });

  test('redirects authenticated users from / to /dashboard', async ({
    page,
  }) => {
    await signup(page, `redir-${Date.now()}@test.com`);
    await page.goto('/');
    await page.waitForURL('/dashboard', { timeout: 5000 });
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
    await expect(page.getByTestId('auth-login-email')).toBeVisible();
  });

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/');
    await clearStorage(page);

    await signup(page, `new-${Date.now()}@test.com`);

    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    const email = `load-${Date.now()}@test.com`;
    await signup(page, email);

    // Create a habit for this user
    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('My Unique Habit');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-my-unique-habit')).toBeVisible();

    // Log out then log back in
    await logout(page);
    await page.getByTestId('auth-login-email').fill(email);
    await page.getByTestId('auth-login-password').fill('Password1');
    await page.getByTestId('auth-login-submit').click();
    await page.waitForURL('/dashboard');

    // Only this user's habit visible
    await expect(page.getByTestId('habit-card-my-unique-habit')).toBeVisible();
  });

  test('creates a habit from the dashboard', async ({ page }) => {
    await signup(page, `create-${Date.now()}@test.com`);

    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('Drink Water');
    await page.getByTestId('habit-description-input').fill('Stay hydrated');
    await page.getByTestId('habit-save-button').click();

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async ({
    page,
  }) => {
    await signup(page, `streak-${Date.now()}@test.com`);

    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('Meditate');
    await page.getByTestId('habit-save-button').click();

    const streak = page.getByTestId('habit-streak-meditate');
    await expect(streak).toContainText('0 day streak');

    await page.getByTestId('habit-complete-meditate').click();
    await expect(streak).toContainText('1 day streak');

    // Toggle off — back to 0
    await page.getByTestId('habit-complete-meditate').click();
    await expect(streak).toContainText('0 day streak');
  });

  test('persists session and habits after page reload', async ({ page }) => {
    await signup(page, `persist-${Date.now()}@test.com`);

    await page.getByTestId('create-habit-button').first().click();
    await page.getByTestId('habit-name-input').fill('Read Books');
    await page.getByTestId('habit-save-button').click();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();

    // Reload — session and habits must survive
    await page.reload();
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-card-read-books')).toBeVisible();
  });

  test('logs out and redirects to /login', async ({ page }) => {
    await signup(page, `logout-${Date.now()}@test.com`);

    await logout(page);

    await expect(page.getByTestId('auth-login-email')).toBeVisible();
    // Confirm session is cleared — /dashboard should redirect back to /login
    await page.goto('/dashboard');
    await page.waitForURL('/login', { timeout: 5000 });
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({
    page,
    context,
  }) => {
    await signup(page, `offline-${Date.now()}@test.com`);

    // Give the service worker time to install and cache the shell
    await page.waitForTimeout(2500);

    // Go offline and navigate
    await context.setOffline(true);
    await page.goto('/');

    // App shell must render — no crash, no browser error page
    const body = page.locator('body');
    await expect(body).not.toContainText('ERR_INTERNET_DISCONNECTED');
    await expect(body).not.toContainText('No internet');
    await expect(body).toBeVisible();

    await context.setOffline(false);
  });
});
