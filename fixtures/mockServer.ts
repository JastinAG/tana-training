import http from 'http';
import { AddressInfo } from 'net';

let server: http.Server | null = null;
let baseURL: string | null = null;

const jsonHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*'
};

function sendJson(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, jsonHeaders);
  res.end(JSON.stringify(payload));
}

function handleRequest(req: http.IncomingMessage, res: http.ServerResponse) {
  const { method, url = '' } = req;

  if (method === 'GET' && url.startsWith('/api/users?page=')) {
    return sendJson(res, 200, {
      page: 2,
      per_page: 6,
      total: 12,
      total_pages: 2,
      data: [{ id: 1, email: 'janet.weaver@reqres.in', first_name: 'Janet', last_name: 'Weaver' }],
      support: { url: 'https://reqres.in/#support-heading', text: 'Support ReqRes' }
    });
  }

  if (method === 'GET' && url.startsWith('/api/users/9999')) {
    res.writeHead(404, jsonHeaders);
    return res.end('');
  }

  if (method === 'POST' && url.startsWith('/api/users')) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const parsed = body ? JSON.parse(body) : {};
      return sendJson(res, 201, {
        ...parsed,
        id: Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString()
      });
    });
    return;
  }

  if (method === 'PUT' && url.startsWith('/api/users')) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const parsed = body ? JSON.parse(body) : {};
      return sendJson(res, 200, {
        ...parsed,
        updatedAt: new Date().toISOString()
      });
    });
    return;
  }

  if (method === 'DELETE' && url.startsWith('/api/users')) {
    res.writeHead(204, jsonHeaders);
    return res.end('');
  }

  res.writeHead(404, jsonHeaders);
  res.end('');
}

export async function ensureMockServer(): Promise<string> {
  if (baseURL) return baseURL;

  server = http.createServer(handleRequest);
  await new Promise<void>(resolve => server!.listen(0, '127.0.0.1', resolve));

  const address = server.address() as AddressInfo;
  baseURL = `http://127.0.0.1:${address.port}`;
  return baseURL;
}

export async function stopMockServer() {
  if (!server) return;
  await new Promise<void>((resolve, reject) =>
    server!.close(err => (err ? reject(err) : resolve()))
  );
  server = null;
  baseURL = null;
}
