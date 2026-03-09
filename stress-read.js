import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  discardResponseBodies: false,
  
  thresholds: {
    'http_req_duration{type:redirect}': ['p(95)<50', 'p(99)<150'],
    http_req_failed: ['rate<0.01'],
  },
  
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 40,
      timeUnit: '1s',
      duration: '3m',
      preAllocatedVUs: 30,
      maxVUs: 200,
    },
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
}