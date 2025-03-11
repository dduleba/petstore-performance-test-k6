import { check, sleep } from 'k6';
// Usunięto import Counter z 'k6/metrics'

// Prosta funkcja licznika błędów
let errorCount = 0;
export function countError() {
  errorCount++;
  console.error(`Total errors: ${errorCount}`);
}

export function checkStatus(res, expectedStatus) {
  const success = check(res, {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
  });

  if (!success) {
    console.error(`Expected status ${expectedStatus} but got ${res.status}. Response: ${res.body}`);
    countError();
  }

  return success;
}

export function randomSleep() {
  sleep(Math.random() * 2 + 1); // Losowy czas pomiędzy 1-3s
}