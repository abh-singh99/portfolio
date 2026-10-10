// A mock of the Apex Parts orders API for the backend demo. Two defects are
// planted: GET /api/products/:id answers 200 with a null body for an unknown
// product (the contract says 404), and /api/reports/summary breaks the 300 ms
// response budget.

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export type ApiRequest = { method: Method; path: string; headers: string; body: string };
export type ApiResponse = { status: number; ms: number; headers: Record<string, string>; body: string };
export type Expectation = { status: number; maxMs: number; keys: string[] };
export type Assertion = { label: string; pass: boolean; detail: string };

const PRODUCTS = [
  { id: 'p1', name: 'Carbon ceramic brake kit', price: 120, stock: 40 },
  { id: 'p2', name: 'Titanium exhaust', price: 890, stock: 0 },
  { id: 'p3', name: 'Coilover set', price: 1299, stock: 7 },
];

export const STATUS_TEXT: Record<number, string> = {
  200: 'OK', 201: 'Created', 204: 'No Content', 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found',
  405: 'Method Not Allowed', 409: 'Conflict', 422: 'Unprocessable Entity',
};

export function parseHeaders(text: string) {
  const h: Record<string, string> = {};
  text.split(/\r?\n/).forEach((l) => {
    const i = l.indexOf(':');
    if (i > 0) h[l.slice(0, i).trim().toLowerCase()] = l.slice(i + 1).trim();
  });
  return h;
}

export type ApiState = { orders: Map<string, unknown>; next: number };
export const newState = (): ApiState => ({ orders: new Map(), next: 1001 });

export function route(req: ApiRequest, state: ApiState): ApiResponse {
  const method = req.method;
  const path = req.path.split('?')[0].replace(/\/+$/, '') || '/';
  const hd = parseHeaders(req.headers);
  const jitter = (n: number) => n + ((path.length * 7 + method.length * 13) % 25);
  const reply = (status: number, obj: unknown, ms: number, extra: Record<string, string> = {}): ApiResponse => ({
    status,
    ms: jitter(ms),
    headers: { ...(obj === undefined ? {} : { 'content-type': 'application/json' }), ...extra },
    body: obj === undefined ? '' : JSON.stringify(obj, null, 2),
  });
  const authed = hd.authorization === 'Bearer demo-token';
  const unauth = () => reply(401, { error: 'unauthorized' }, 40, { 'www-authenticate': 'Bearer' });

  const table: [RegExp, Partial<Record<Method, (m: RegExpMatchArray) => ApiResponse>>][] = [
    [/^\/api\/products$/, { GET: () => reply(200, { items: PRODUCTS, count: PRODUCTS.length }, 70) }],
    [/^\/api\/products\/([^/]+)$/, {
      GET: (m) => {
        const p = PRODUCTS.find((x) => x.id === m[1]);
        // Planted defect: should be 404 { error: 'product_not_found' }.
        return p ? reply(200, p, 60) : reply(200, null, 50);
      },
    }],
    [/^\/api\/orders$/, {
      POST: () => {
        if (!authed) return unauth();
        let b: { productId?: unknown; qty?: unknown };
        try {
          b = JSON.parse(req.body || '');
        } catch {
          return reply(400, { error: 'invalid_json' }, 45);
        }
        if (!b || typeof b !== 'object' || Array.isArray(b)) return reply(400, { error: 'invalid_json' }, 45);
        const errors: Record<string, string> = {};
        if (typeof b.productId !== 'string' || !b.productId) errors.productId = 'required';
        if (!Number.isInteger(b.qty) || (b.qty as number) < 1 || (b.qty as number) > 10) errors.qty = 'must be a whole number from 1 to 10';
        if (Object.keys(errors).length) return reply(422, { errors }, 55);
        const p = PRODUCTS.find((x) => x.id === b.productId);
        if (!p) return reply(404, { error: 'product_not_found' }, 50);
        const qty = b.qty as number;
        if (qty > p.stock) return reply(409, { error: 'insufficient_stock', available: p.stock }, 65);
        const id = `ord_${state.next++}`;
        state.orders.set(id, { productId: p.id, qty });
        return reply(201, { id, productId: p.id, qty, total: p.price * qty, status: 'created' }, 90, { location: `/api/orders/${id}` });
      },
    }],
    [/^\/api\/orders\/([^/]+)$/, {
      DELETE: (m) => {
        if (!authed) return unauth();
        if (!state.orders.has(m[1])) return reply(404, { error: 'order_not_found' }, 45);
        state.orders.delete(m[1]);
        return reply(204, undefined, 50);
      },
    }],
    // Planted defect: far over the 300 ms budget.
    [/^\/api\/reports\/summary$/, { GET: () => reply(200, { orders: state.orders.size, revenue: 0 }, 420) }],
  ];
  for (const [re, handlers] of table) {
    const m = path.match(re);
    if (!m) continue;
    const h = handlers[method];
    if (h) return h(m);
    return reply(405, { error: 'method_not_allowed' }, 40, { allow: Object.keys(handlers).join(', ') });
  }
  return reply(404, { error: 'route_not_found' }, 40);
}

export function assertResponse(res: ApiResponse, exp: Expectation): Assertion[] {
  const out: Assertion[] = [
    { label: `Status code is ${exp.status}`, pass: res.status === exp.status, detail: `got ${res.status}` },
    { label: `Response time is below ${exp.maxMs} ms`, pass: res.ms < exp.maxMs, detail: `${res.ms} ms` },
  ];
  if (exp.keys.length) {
    let j: unknown = null;
    try {
      j = JSON.parse(res.body);
    } catch {
      j = null;
    }
    const isObj = !!j && typeof j === 'object';
    const missing = isObj ? exp.keys.filter((k) => !(k in (j as object))) : exp.keys;
    out.push({
      label: `Body has ${exp.keys.join(', ')}`,
      pass: isObj && missing.length === 0,
      detail: isObj ? (missing.length ? `missing ${missing.join(', ')}` : 'all present') : 'body is not a JSON object',
    });
  }
  return out;
}

export function testScript(exp: Expectation) {
  const lines = [
    `pm.test("Status code is ${exp.status}", () => {`,
    `  pm.response.to.have.status(${exp.status});`,
    `});`,
    `pm.test("Response time is below ${exp.maxMs} ms", () => {`,
    `  pm.expect(pm.response.responseTime).to.be.below(${exp.maxMs});`,
    `});`,
  ];
  if (exp.keys.length)
    lines.push(
      `pm.test("Body has ${exp.keys.join(', ')}", () => {`,
      `  pm.expect(pm.response.json()).to.include.keys(${exp.keys.map((k) => JSON.stringify(k)).join(', ')});`,
      `});`,
    );
  return lines.join('\n');
}

const AUTH = 'Authorization: Bearer demo-token\nContent-Type: application/json';
export type Preset = ApiRequest & { id: string; name: string; folder: string; exp: Expectation };
export const PRESETS: Preset[] = [
  { id: 'list', folder: 'Products', name: 'List products', method: 'GET', path: '/api/products', headers: 'Accept: application/json', body: '', exp: { status: 200, maxMs: 300, keys: ['items', 'count'] } },
  { id: 'unknown', folder: 'Products', name: 'Unknown product', method: 'GET', path: '/api/products/p99', headers: 'Accept: application/json', body: '', exp: { status: 404, maxMs: 300, keys: ['error'] } },
  { id: 'create', folder: 'Orders', name: 'Create order', method: 'POST', path: '/api/orders', headers: AUTH, body: '{\n  "productId": "p1",\n  "qty": 3\n}', exp: { status: 201, maxMs: 300, keys: ['id', 'total', 'status'] } },
  { id: 'notoken', folder: 'Orders', name: 'Create order · no token', method: 'POST', path: '/api/orders', headers: 'Content-Type: application/json', body: '{\n  "productId": "p1",\n  "qty": 1\n}', exp: { status: 401, maxMs: 300, keys: ['error'] } },
  { id: 'badjson', folder: 'Orders', name: 'Create order · malformed JSON', method: 'POST', path: '/api/orders', headers: AUTH, body: '{\n  "productId": "p1",', exp: { status: 400, maxMs: 300, keys: ['error'] } },
  { id: 'limit', folder: 'Orders', name: 'Create order · qty 11', method: 'POST', path: '/api/orders', headers: AUTH, body: '{\n  "productId": "p1",\n  "qty": 11\n}', exp: { status: 422, maxMs: 300, keys: ['errors'] } },
  { id: 'stock', folder: 'Orders', name: 'Create order · out of stock', method: 'POST', path: '/api/orders', headers: AUTH, body: '{\n  "productId": "p2",\n  "qty": 1\n}', exp: { status: 409, maxMs: 300, keys: ['error', 'available'] } },
  { id: 'method', folder: 'Orders', name: 'Wrong method', method: 'PUT', path: '/api/orders', headers: AUTH, body: '{}', exp: { status: 405, maxMs: 300, keys: ['error'] } },
  { id: 'slow', folder: 'Reports', name: 'Sales summary', method: 'GET', path: '/api/reports/summary', headers: 'Accept: application/json', body: '', exp: { status: 200, maxMs: 300, keys: ['orders'] } },
];
