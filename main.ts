import { Application, Router } from './deps.ts';
import { dayForRouter } from './src/day-for/index.ts'

const app = new Application();
const router = new Router().use('/api/day-for', dayForRouter.routes(), dayForRouter.allowedMethods());

app.use(router.routes());

console.log('Server running on port 8000');

await app.listen({ port: 8000 });
