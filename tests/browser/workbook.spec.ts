import { test, expect } from '@playwright/test';
const paths = ['single-responsibility', 'open-closed', 'liskov-substitution', 'interface-segregation', 'dependency-inversion'];
for (const [i, slug] of paths.entries()) {
  test(`lesson ${i + 1} connects guide, real source and runnable demo`, async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`./#/principle/${i + 1}-${slug}`);
    await expect(page.getByRole('navigation', { name: 'Lesson sections' })).toBeVisible();
    await page.getByRole('button', { name: 'Refactored', exact: true }).click();
    await expect(page.getByLabel('Refactored source')).toContainText('export');
    await page.getByRole('button', { name: 'Demo', exact: true }).click();
    if (i === 0) {
      await expect(page.getByRole('heading', { name: 'Morgan Ellis' })).toBeVisible();
      await page.getByLabel('Name', { exact: true }).fill('Morgan Reed'); await page.getByRole('button', { name: 'Save profile' }).click();
      await expect(page.getByRole('heading', { name: 'Morgan Reed' })).toBeVisible();
      await page.getByLabel('Sample source offline').check(); await page.getByRole('button', { name: 'Refresh profile' }).click();
      await expect(page.getByRole('alert')).toContainText('retained'); await expect(page.getByRole('heading', { name: 'Morgan Reed' })).toBeVisible();
      await page.getByLabel('Sample source offline').uncheck(); await page.getByRole('button', { name: 'Refresh profile' }).click();
      await expect(page.getByRole('alert')).toHaveCount(0);
      await page.screenshot({ path: 'test-results/contact-desk.png', fullPage: true });
    } else if (i === 1) {
      await page.getByRole('button', { name: 'Send Slack' }).click(); await expect(page.getByRole('status')).toContainText('Slack');
    } else if (i === 2) {
      await page.getByRole('button', { name: 'Calculate Total Area' }).click(); await expect(page.getByText('Total Area: 41.57')).toBeVisible();
    } else if (i === 3) {
      await page.getByRole('button', { name: 'Demonstrate Proper ISP' }).click(); await expect(page.locator('pre')).toContainText('Robot charging battery');
    } else {
      await page.getByLabel('Notification channel').selectOption('sms'); await page.getByRole('button', { name: 'Record sample order' }).click(); await expect(page.getByRole('status')).toContainText('SMS receipt');
    }
    await page.reload(); await expect(page.getByRole('navigation', { name: 'Lesson sections' })).toBeVisible(); expect(errors).toEqual([]);
  });
}
test('practice bench gives feedback for the selected principle', async ({ page }) => {
  await page.goto('./#/playground'); await page.getByLabel('Principle', { exact: true }).selectOption('4');
  await page.getByRole('button', { name: 'An injected spy records the SMS call' }).click();
  await expect(page.getByRole('status')).toContainText('That fits this constraint');
  await page.getByRole('link', { name: 'Open the lesson and exercise' }).click();
  await expect(page.getByRole('heading', { name: 'Dependency Inversion', exact: true })).toBeVisible();
});
test('mobile contact desk stays within the viewport and supports keyboard controls', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('./#/principle/1-single-responsibility');
  await page.getByRole('link', { name: 'Skip to content' }).focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();
  await expect(page.getByRole('navigation', { name: 'Lesson sections' })).toBeVisible();
  const demo = page.getByRole('button', { name: 'Demo', exact: true }); await demo.focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Morgan Ellis' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/contact-desk-mobile.png', fullPage: true });
});
test('dark contact desk renders its loaded data', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' }); await page.goto('./#/principle/1-single-responsibility');
  await page.getByRole('button', { name: 'Demo', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Morgan Ellis' })).toBeVisible();
  await page.screenshot({ path: 'test-results/contact-desk-dark.png', fullPage: true });
});

for (const mode of ['desktop', 'mobile', 'dark'] as const) {
  test(`dispatch compatibility lab: ${mode}`, async ({ page }) => {
    if (mode === 'mobile') await page.setViewportSize({ width: 390, height: 844 });
    if (mode === 'dark') await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('./#/principle/2-open-closed');
    await page.getByRole('button', { name: 'Extension Lab', exact: true }).click();
    await expect(page.getByTestId('dispatch-row-1')).toContainText('UNSUPPORTED');
    const unchanged = await page.getByTestId('dispatch-row-0').innerText();
    await page.getByRole('button', { name: 'Include webhook extension' }).click();
    await expect(page.getByTestId('dispatch-row-1')).toContainText('Webhook preview');
    await expect(page.getByTestId('dispatch-row-0')).toHaveText(unchanged, { useInnerText: true });
    await expect(page.getByTestId('dispatch-row-2')).toContainText('UNSUPPORTED');
    await expect(page.getByTestId('dispatch-row-3')).toContainText('Invalid payload');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.screenshot({ path: `test-results/dispatch-lab-${mode}.png`, fullPage: true });
    await page.getByRole('button', { name: 'Include webhook extension' }).click();
    await expect(page.getByTestId('dispatch-row-1')).toContainText('UNSUPPORTED');
  });
}
