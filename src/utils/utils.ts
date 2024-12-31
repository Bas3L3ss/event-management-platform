export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  if (obj1 == null || obj2 == null) return false;
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;
  for (let key in obj1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }
  return true;
};

export function calculateEventPrice(dateStart: Date, dateEnd: Date): number {
  const dayRate = 2; // $2 per day

  // Calculate the number of days between the two dates
  const timeDifference = dateEnd.getTime() - dateStart.getTime();
  const dayDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));

  // Calculate the price
  const totalPrice = dayDifference * dayRate;

  return totalPrice * 100;
}
export function limitWords(inputString: string, maxWords: number): string {
  const wordsArray = inputString.split(" ");
  const limitedWords = wordsArray.slice(0, maxWords);
  return limitedWords.join(" ");
}
export const renderError = (
  error: unknown
): { message: string; isError: boolean } => {
  return {
    isError: true,
    message: error instanceof Error ? error.message : "An error occurred.",
  };
};

export function removeDuplicates(urls: string[]): string[] {
  // Use a Set to automatically filter out duplicates
  const uniqueUrls = Array.from(new Set(urls));
  return uniqueUrls;
}
