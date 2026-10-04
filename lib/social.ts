/**
 * Accessible name for external Facebook links.
 *
 * - Icon-only links:  "El Shaddai World Ministries on Facebook (opens in a new tab)"
 * - Links with visible text: the visible text comes FIRST so the accessible name
 *   contains it (WCAG 2.5.3 Label in Name), then the church name:
 *   "Follow on Facebook – El Shaddai World Ministries (opens in a new tab)"
 *
 * Visible text that is exactly "Facebook" is already contained in the icon-only form.
 */
export function facebookLabel(churchName: string, visibleText?: string) {
  if (!visibleText || visibleText.trim().toLowerCase() === 'facebook') {
    return `${churchName} on Facebook (opens in a new tab)`;
  }
  return `${visibleText} – ${churchName} (opens in a new tab)`;
}
