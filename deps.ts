import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { load } from "https://deno.land/std/dotenv/mod.ts";

const kv = await Deno.openKv();

export { Application, Router, load, kv };