export function parseISODate(ISODate) {
  const parsed = ISODate.match(/(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})/);

  return { day: parsed[1], time: parsed[2] };
}
