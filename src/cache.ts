import { load, Redis } from "../deps.ts"

const env = await load();
const UPSTASH_TOKEN = env.UPSTASH_TOKEN;
const UPSTASH_URL = env.UPSTASH_URL;

export type CachedValue = { [x: string]: string } | null

export const cachey = () => {
  const redis = new Redis({
    url: UPSTASH_URL,
    token: UPSTASH_TOKEN,
  })

  const set = async (key: string, value: { [x: string]: string | number | boolean }): Promise<void> => {
    await redis.set(key, value);
  }

  const get = async (key: string): Promise<CachedValue> => {
    return await redis.get(key);
  }

  const exists = async (key: string): Promise<number> => {
    return await redis.exists(key);
  }

  return {
    set,
    get,
    exists,
  }
}