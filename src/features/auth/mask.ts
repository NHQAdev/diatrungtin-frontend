/** "minhanh@example.com" → "mi••••@example.com" (enough to recognise, not to read off a screen). */
export function maskEmail(email: string): string {
  const at = email.lastIndexOf('@');
  if (at <= 0) return email;
  const name = email.slice(0, at);
  const visible = name.length <= 2 ? name.slice(0, 1) : name.slice(0, 2);
  return `${visible}${'•'.repeat(4)}${email.slice(at)}`;
}

/** Initials for the avatar: last two words of a Vietnamese name ("Nguyễn Minh Anh" → "MA"). */
export function initials(fullName: string): string {
  const words = fullName.trim().split(/\s+/).filter(Boolean);
  const picked = words.length >= 2 ? words.slice(-2) : words;
  return picked.map((word) => word[0]!.toUpperCase()).join('') || '?';
}
