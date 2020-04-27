import serve from 'koa-static'
export default () => ({ path, opts }) => serve(path, opts)
