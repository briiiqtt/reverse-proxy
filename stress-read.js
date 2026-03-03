import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  discardResponseBodies: false,
  stages: [
    { duration: '60s', target: 30 },
    { duration: '120s', target: 30 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{type:redirect}': ['p(95)<50', 'p(99)<150'],
    http_req_failed: ['rate<0.01'],
  },
};

const API_URL = 'https://s.bombs.kr/cYnKqZzQ';

export default function () {
  const res = http.get(API_URL, {
    tags: { type: 'redirect' },
    redirects: 0,
  });
  check(res, {
    'res.status is 302 FOUND': (r) => r.status === 302,
  });
  sleep(0.1);
}
