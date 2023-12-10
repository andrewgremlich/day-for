import "https://deno.land/std@0.201.0/dotenv/load.ts";

import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const kv = await Deno.openKv();

export { Application, Router, kv, oakCors };