export const index = ({}) =>
	`import health from './health';
export default [...health];`;
export const health = ({}) =>
	(`import { OK } from 'http-status-codes';
import httpMethods from 'http-methods-enum'
const { GET } = httpMethods;
export const handler = (ctx, next) => {
  ctx.body = { health: 'OK' };
  ctx.status = OK;
};

export const error = (ctx, next) => {
  throw new Error('You get an error!')
};
export default [
()=>({ method: GET, path: '/health', handler }),
()=>({ method: GET, path: '/error', handler:error })
];`);
