import { check, sleep } from 'k6';
import { Counter } from 'k6/metrics';
export const errorCounter = new Counter('errors');
export function checkStatus(res, expectedStatus) {
  const success = check(res, {
    [status is ${expectedStatus}]: (r) => r.status === expectedStatus,
  });
  if (!success) {
    console.error(Expected status ${expectedStatus} but got ${res.status}. Response: ${res.body});
    errorCounter.add(1);
  }
  return success;
}
export function randomSleep() {
  sleep(Math.random() * 2 + 1); // Losowy czas pomiędzy 1-3s
}
