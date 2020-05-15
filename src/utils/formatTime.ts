const convertToHours = (seconds: number): string => {
  const date = new Date(null);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};

export const formatTime = (seconds: number): string[] => {
  const time = convertToHours(seconds);
  const arr = time.split(':');
  return arr;
};
