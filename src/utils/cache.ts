import { revalidateTag } from "next/cache";
import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

type Callback = (...args: any[]) => Promise<any>;
export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}

export async function invalidateCache(keyParts: string[]) {
  try {
    const tag = keyParts.join(":");

    revalidateTag(tag);

    return true;
  } catch (error) {
    console.error("Error invalidating cache:", error);
    return false;
  }
}
