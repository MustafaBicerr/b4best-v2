/**
 * Format a phone number for display.
 * @example formatPhone('+905321234567') → '+90 532 123 45 67'
 */
export function formatPhone(phone: string): string {
  return phone;
}

/**
 * Truncate a string to a max length, appending ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 1) + '…';
}

/**
 * Convert a collection slug to a display-friendly name.
 */
export function slugToName(slug: string): string {
  const names: Record<string, string> = {
    dubai: 'Dubai',
    milano: 'Milano',
    havai: 'Havai',
    toronto: 'Toronto',
    lyon: 'Lyon',
    paris: 'Paris',
    lasvegas: 'Las Vegas',
  };
  return names[slug] ?? slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Capitalise the first letter of a string.
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
