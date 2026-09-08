export function relativeTime(
  date: Date | string | number,
  locale: string = "id-ID",
): string {
  const timeMs = new Date(date).getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  const cutoffs = [
    60, // detik dalam 1 menit
    3600, // detik dalam 1 jam
    86400, // detik dalam 1 hari
    86400 * 30, // detik dalam ~1 bulan
    86400 * 365, // detik dalam ~1 tahun
  ];

  const units: Intl.RelativeTimeFormatUnit[] = [
    "second",
    "minute",
    "hour",
    "day",
    "month",
    "year",
  ];

  // Cari unit waktu yang sesuai dengan selisih waktu
  const unitIndex = cutoffs.findIndex(
    (cutoff) => Math.abs(deltaSeconds) < cutoff,
  );

  const divisor =
    unitIndex === 0
      ? 1
      : unitIndex > 0
        ? cutoffs[unitIndex - 1]
        : cutoffs[cutoffs.length - 1];
  const selectedUnit = unitIndex === -1 ? "year" : units[unitIndex];

  const value = Math.floor(deltaSeconds / divisor);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  return rtf.format(value, selectedUnit);
}
