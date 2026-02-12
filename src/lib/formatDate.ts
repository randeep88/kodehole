import { differenceInDays, formatDistanceToNow, format } from "date-fns";

export function formatDate(dateInput: string | Date) {
  const date = new Date(dateInput);
  const now = new Date();

  const daysDiff = differenceInDays(now, date);

  if (daysDiff < 30) {
    return `Updated ${formatDistanceToNow(date, {
      addSuffix: true,
    })}`;
  }

  return `Updated on ${format(date, "dd MMMM, yyyy")}`;
}
