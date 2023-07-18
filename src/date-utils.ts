export const isTimestamp = (timestamp: number): boolean => !isNaN(new Date(timestamp).getTime());
