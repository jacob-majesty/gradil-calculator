const meterFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

export function formatMeters(value: number): string {
  return meterFormatter.format(value);
}

export function formatDateTime(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}
