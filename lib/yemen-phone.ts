/** Yemen mobile numbers: 9 digits starting with 7 → +967 770 838 513 */

export function normalizeYemenPhone(input: string): string | null {
  let digits = input.replace(/\D/g, '')

  if (digits.startsWith('967')) {
    digits = digits.slice(3)
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  if (!/^7\d{8}$/.test(digits)) {
    return null
  }

  return `+967 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`
}

/** Format while typing: accepts 770838513, 770 838 513, 0770838513, etc. */
export function formatYemenPhoneInput(input: string): string {
  let digits = input.replace(/\D/g, '')

  if (digits.startsWith('967')) {
    digits = digits.slice(3)
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  digits = digits.slice(0, 9)

  if (!digits) return ''

  if (digits.length <= 3) {
    return `+967 ${digits}`
  }
  if (digits.length <= 6) {
    return `+967 ${digits.slice(0, 3)} ${digits.slice(3)}`
  }
  return `+967 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
}
