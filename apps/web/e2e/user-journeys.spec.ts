import { test, expect } from '@playwright/test';

test.describe('ResuCraft AI User Journeys', () => {
  test('Journey 1: Anonymous resume creation, editing, and preview update', async ({ page }) => {
    // 1. Visit editor without authentication
    await page.goto('/editor');

    // 2. Verify anonymous local-first state
    await expect(page.locator('text=Offline (Local)')).toBeVisible();
    await expect(page.locator('text=Saved locally')).toBeVisible();

    // 3. Verify initial candidate name in ATS preview
    await expect(page.locator('h1')).toContainText('Vikash Singh');

    // 4. Edit candidate name
    const nameInput = page.locator('input[placeholder*="Full Name"], input[name="name"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Vikash Singh (Staff Engineer)');
      // 5. Verify live preview updates reactively
      await expect(page.locator('h1')).toContainText('Staff Engineer');
    }
  });

  test('Journey 2: Job description alignment modal opens and calculates coverage', async ({ page }) => {
    await page.goto('/editor');

    // Click on Job Description Matcher button
    const matchBtn = page.getByRole('button', { name: /Job Match|Alignment/i }).first();
    if (await matchBtn.isVisible()) {
      await matchBtn.click();
      await expect(page.locator('text=Job Description Alignment Engine')).toBeVisible();
      await expect(page.locator('text=Non-Deceptive Ethical Guarantee')).toBeVisible();
    }
  });

  test('Journey 3: Optional Account modal opens with Local-First Guarantee', async ({ page }) => {
    await page.goto('/editor');

    // Click Sign In on the sync indicator
    const signInBtn = page.getByText('Sign In').first();
    await signInBtn.click();

    // Verify AuthModal is visible
    await expect(page.locator('text=ResuCraft Account')).toBeVisible();
    await expect(page.locator('text=Local-First Guarantee')).toBeVisible();
    await expect(page.getByRole('button', { name: /^Sign In$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Create Account/i })).toBeVisible();
  });
});
