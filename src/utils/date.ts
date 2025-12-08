const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SLASH_DATE_PATTERN = /^\d{2}\/\d{2}\/\d{4}$/;

export const normalizeDateInput = (value?: string | null): string | null => {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  if (SLASH_DATE_PATTERN.test(trimmed)) {
    const [day, month, year] = trimmed.split("/");
    return `${year}-${month}-${day}`;
  }

  if (DATE_ONLY_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{4}-\d{2}-\d{2}T/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{4}-\d{2}-\d{2} \d{2}/.test(trimmed)) {
    return trimmed.replace(" ", "T");
  }

  return trimmed;
};

export const parseDateSafely = (value?: string | null): Date | null => {
  const normalized = normalizeDateInput(value);
  if (!normalized) {
    return null;
  }

  const isoCandidate = DATE_ONLY_PATTERN.test(normalized)
    ? `${normalized}T00:00:00`
    : normalized;

  const parsed = new Date(isoCandidate);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const padTwo = (num: number) => num.toString().padStart(2, "0");

export const formatDateYMD = (
  value?: string | null,
  options: { includeTime?: boolean } = {}
): string => {
  const normalized = normalizeDateInput(value);
  if (!normalized) {
    return "Không xác định";
  }

  const datePartMatch =
    normalized.match(DATE_ONLY_PATTERN) ||
    normalized.match(/^\d{4}-\d{2}-\d{2}/);
  if (!datePartMatch) {
    return "Không xác định";
  }

  const datePart = datePartMatch[0];
  const { includeTime = false } = options;

  if (!includeTime) {
    return datePart;
  }

  const timeMatch =
    normalized.match(/T(\d{2}):(\d{2})/) ||
    normalized.match(/ (\d{2}):(\d{2})/);
  if (timeMatch) {
    return `${datePart} ${padTwo(Number(timeMatch[1]))}:${padTwo(
      Number(timeMatch[2])
    )}`;
  }

  const date = parseDateSafely(normalized);
  if (!date) {
    return datePart;
  }

  const hours = padTwo(date.getHours());
  const minutes = padTwo(date.getMinutes());

  return `${datePart} ${hours}:${minutes}`;
};
