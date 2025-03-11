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
  // Wyszukaj zwierzęta po statusie
  const statuses = ['available', 'pending', 'sold'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  // W oryginalnym kodzie brakuje backticks:
  const res = http.get(`${BASE_URL}/api/v3/pet/findByStatus?status=${randomStatus}`);

  // Sprawdzamy status odpowiedzi
  checkStatus(res, 200);

  // Sprawdzamy czy odpowiedź zawiera listę
  check(res, {
    'response is array': (r) => Array.isArray(JSON.parse(r.body)),
  });

  sleep(1);
}