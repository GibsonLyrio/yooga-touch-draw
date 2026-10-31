export const WHATSAPP_DIGIT_COUNT = 11;

export function whatsappDigits(value: string): string {
  return value.replace(/\D/g, "").slice(0, WHATSAPP_DIGIT_COUNT);
}

export function formatWhatsapp(value: string): string {
  const digits = whatsappDigits(value);
  if (!digits) return "";

  const areaCode = digits.slice(0, 2);
  const firstPart = digits.slice(2, 7);
  const lastPart = digits.slice(7);

  if (digits.length < 3) return `(${areaCode}`;
  if (digits.length < 8) return `(${areaCode}) ${firstPart}`;
  return `(${areaCode}) ${firstPart}-${lastPart}`;
}

export function isValidWhatsapp(value: string): boolean {
  return whatsappDigits(value).length === WHATSAPP_DIGIT_COUNT;
}
