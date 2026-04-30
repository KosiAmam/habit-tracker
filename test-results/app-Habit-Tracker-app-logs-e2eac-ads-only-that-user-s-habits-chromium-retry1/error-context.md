# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Habit Tracker app >> logs in an existing user and loads only that user's habits
- Location: tests\e2e\app.spec.ts:65:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('auth-logout-button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e6]
      - paragraph [ref=e9]: Habit Tracker
    - generic [ref=e10]:
      - generic [ref=e11]:
        - heading "Welcome back" [level=1] [ref=e12]
        - paragraph [ref=e13]: Your streak is waiting for you.
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]: Email address
          - textbox "Email address" [ref=e17]:
            - /placeholder: you@example.com
        - generic [ref=e18]:
          - generic [ref=e19]: Password
          - generic [ref=e20]:
            - textbox "Password" [ref=e21]:
              - /placeholder: ••••••••
            - button "Show password" [ref=e22] [cursor=pointer]:
              - img [ref=e23]
        - button "Sign in →" [ref=e26] [cursor=pointer]
      - paragraph [ref=e27]:
        - text: No account yet?
        - link "Sign up" [ref=e28] [cursor=pointer]:
          - /url: /signup
  - alert [ref=e29]
```

# Test source

```ts
  1   | import { test, expect, type Page } from '@playwright/test';
  2   | 
  3   | // ── Helpers ────────────────────────────────────────────────────────────────
  4   | 
  5   | async function clearStorage(page: Page) {
  6   |   await page.evaluate(() => localStorage.clear());
  7   | }
  8   | 
  9   | async function signup(page: Page, email: string, password = 'Password1') {
  10  |   await page.goto('/signup');
  11  |   await page.getByTestId('auth-signup-email').fill(email);
  12  |   await page.getByTestId('auth-signup-password').fill(password);
  13  |   await page.getByTestId('auth-signup-submit').click();
  14  |   await page.waitForURL('/dashboard');
  15  | }
  16  | 
  17  | async function logout(page: Page) {
  18  |   await page.getByText('Log out').first().click();
> 19  |   await page.getByTestId('auth-logout-button').click();
      |                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  20  |   await page.waitForURL('/login');
  21  | }
  22  | 
  23  | // ── Suite ──────────────────────────────────────────────────────────────────
  24  | 
  25  | test.describe('Habit Tracker app', () => {
  26  |   test('shows the splash screen and redirects unauthenticated users to /login', async ({
  27  |     page,
  28  |   }) => {
  29  |     await page.goto('/');
  30  |     await clearStorage(page);
  31  |     await page.goto('/');
  32  | 
  33  |     await expect(page.getByTestId('splash-screen')).toBeVisible();
  34  |     await page.waitForURL('/login', { timeout: 5000 });
  35  |     await expect(page.getByTestId('auth-login-email')).toBeVisible();
  36  |   });
  37  | 
  38  |   test('redirects authenticated users from / to /dashboard', async ({
  39  |     page,
  40  |   }) => {
  41  |     await signup(page, `redir-${Date.now()}@test.com`);
  42  |     await page.goto('/');
  43  |     await page.waitForURL('/dashboard', { timeout: 5000 });
  44  |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  45  |   });
  46  | 
  47  |   test('prevents unauthenticated access to /dashboard', async ({ page }) => {
  48  |     await page.goto('/');
  49  |     await clearStorage(page);
  50  |     await page.goto('/dashboard');
  51  |     await page.waitForURL('/login', { timeout: 5000 });
  52  |     await expect(page.getByTestId('auth-login-email')).toBeVisible();
  53  |   });
  54  | 
  55  |   test('signs up a new user and lands on the dashboard', async ({ page }) => {
  56  |     await page.goto('/');
  57  |     await clearStorage(page);
  58  | 
  59  |     await signup(page, `new-${Date.now()}@test.com`);
  60  | 
  61  |     await expect(page.getByTestId('dashboard-page')).toBeVisible();
  62  |     await expect(page.getByTestId('empty-state')).toBeVisible();
  63  |   });
  64  | 
  65  |   test("logs in an existing user and loads only that user's habits", async ({
  66  |     page,
  67  |   }) => {
  68  |     const email = `load-${Date.now()}@test.com`;
  69  |     await signup(page, email);
  70  | 
  71  |     // Create a habit for this user
  72  |     await page.getByTestId('create-habit-button').first().click();
  73  |     await page.getByTestId('habit-name-input').fill('My Unique Habit');
  74  |     await page.getByTestId('habit-save-button').click();
  75  |     await expect(page.getByTestId('habit-card-my-unique-habit')).toBeVisible();
  76  | 
  77  |     // Log out then log back in
  78  |     await logout(page);
  79  |     await page.getByTestId('auth-login-email').fill(email);
  80  |     await page.getByTestId('auth-login-password').fill('Password1');
  81  |     await page.getByTestId('auth-login-submit').click();
  82  |     await page.waitForURL('/dashboard');
  83  | 
  84  |     // Only this user's habit visible
  85  |     await expect(page.getByTestId('habit-card-my-unique-habit')).toBeVisible();
  86  |   });
  87  | 
  88  |   test('creates a habit from the dashboard', async ({ page }) => {
  89  |     await signup(page, `create-${Date.now()}@test.com`);
  90  | 
  91  |     await page.getByTestId('create-habit-button').first().click();
  92  |     await page.getByTestId('habit-name-input').fill('Drink Water');
  93  |     await page.getByTestId('habit-description-input').fill('Stay hydrated');
  94  |     await page.getByTestId('habit-save-button').click();
  95  | 
  96  |     await expect(page.getByTestId('habit-card-drink-water')).toBeVisible();
  97  |   });
  98  | 
  99  |   test('completes a habit for today and updates the streak', async ({
  100 |     page,
  101 |   }) => {
  102 |     await signup(page, `streak-${Date.now()}@test.com`);
  103 | 
  104 |     await page.getByTestId('create-habit-button').first().click();
  105 |     await page.getByTestId('habit-name-input').fill('Meditate');
  106 |     await page.getByTestId('habit-save-button').click();
  107 | 
  108 |     const streak = page.getByTestId('habit-streak-meditate');
  109 |     await expect(streak).toContainText('0 day streak');
  110 | 
  111 |     await page.getByTestId('habit-complete-meditate').click();
  112 |     await expect(streak).toContainText('1 day streak');
  113 | 
  114 |     // Toggle off — back to 0
  115 |     await page.getByTestId('habit-complete-meditate').click();
  116 |     await expect(streak).toContainText('0 day streak');
  117 |   });
  118 | 
  119 |   test('persists session and habits after page reload', async ({ page }) => {
```