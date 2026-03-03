import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
  stages: [
    { duration: '1m', target: 10 },
    { duration: '1s', target: 0 },
    // { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{type:create}': ['p(95)<300', 'p(99)<800'],
    'http_req_duration{type:redirect}': ['p(95)<50', 'p(99)<150'],
    http_req_failed: ['rate<0.01'],
  },
};

const API_URL = 'https://shorturl.bombs.kr/api/url/shorten';
const VILLAIN = 'VILLAIN';
const FAMOUS = 'FAMOUS';
const NORMAL = 'NORMAL';
const NORMAL_LOOP = [5, 30];
const FAMOUS_LOOP = [50, 300];
const NORMAL_SLEEP = 1;
const FAMOUS_SLEEP = 0.01;

export default function () {
  const dice = randomIntBetween(1, 10);
  let userType = NORMAL;
  if (dice < 2) userType = VILLAIN;
  else if (dice < 3) userType = FAMOUS;

  if (userType == VILLAIN) {
    // 빌런은 조회도 안할 url을 만들기만 함
    for (let i = 0; i < 20; i++) {
      http.post(
        API_URL,
        JSON.stringify({
          url: `https://example.com/${userType}/${Math.random()}`,
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          tags: { type: 'create' },
        },
      );
      sleep(0.1);
    }
    return;
  }

  if (userType == NORMAL || userType == FAMOUS) {
    // 일반인과 유명인은 url을 생성하고 확인차 1회 조회함
    const postRes = http.post(
      API_URL,
      JSON.stringify({
        url: `https://example.com/${userType}/${Math.random()}`,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        tags: { type: 'create' },
      },
    );

    const isOk = check(postRes, {
      'create success': (r) => r.status === 200,
      'has body': (r) => r.body !== null && r.body.length > 0,
    });
    if (isOk) {
      const url = postRes.json().shortenUrl;

      const loopCount = userType == NORMAL ? NORMAL_LOOP : FAMOUS_LOOP;
      const sleepTime = userType == NORMAL ? NORMAL_SLEEP : FAMOUS_SLEEP;

      for (let i = 0; i < randomIntBetween(loopCount[0], loopCount[1]); i++) {
        http.get(url, {
          tags: { type: 'redirect' },
          redirects: 0, // 실제 redirect는 할 필요 없음
        });
        sleep(sleepTime);
      }
    }
    return;
  }
}
