/** Preserve precisely the existing sanitizer's character set, including tab, LF and CR. */
export function stripUnsafeCharacters(value: string): string {
  return Array.from(value).filter(character => {
    const c = character.charCodeAt(0)
    return !(c <= 8 || c === 11 || c === 12 || (c >= 14 && c <= 31) || c === 127 ||
      (c >= 0x200b && c <= 0x200f) || (c >= 0x2028 && c <= 0x202e) || c === 0xfeff)
  }).join('')
}
