import http from 'k6/http';
import { check, sleep } from 'k6';
import { checkStatus } from '../modules/helpers.js';
import { BASE_URL } from '../modules/config.js';
export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 }
  ]
};
export default function() {
  // Wyszukiwanie petów po statusie
  const statuses = ['available', 'pending', 'sold'];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const res = http.get(${BASE_URL}/api/v3/pet/findByStatus?status=${status});
  // Sprawdzamy status odpowiedzi
  checkStatus(res, 200);
  // Sprawdzamy czy odpowiedź to tablica
  check(res, {
    'response is an array': (r) => Array.isArray(JSON.parse(r.body)),
  });
  sleep(1);
}
