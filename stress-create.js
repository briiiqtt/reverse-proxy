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
    'http_req_duration{type:create}': ['p(95)<300', 'p(99)<800'],
    http_req_failed: ['rate<0.01'],
  },
};

const API_URL = 'https://shorturl.bombs.kr/api/url/shorten';

export default function () {
  const res = http.post(
    API_URL,
    JSON.stringify({
      url: `https://example.com/create-stress/${Math.random()}`,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      tags: { type: 'create' },
    },
  );
  check(res, {
    'res.status is 200 OK': (r) => r.status === 200,
    'has shortenUrl': (r) => {
      const body = r.json();
      return (
        body && body.hasOwnProperty('shortenUrl') && body.shortenUrl.length > 0
      );
    },
  });
  sleep(0.1);
}
