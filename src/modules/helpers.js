import { check, sleep } from 'k6';

// Dodaj definicję i eksport errorCounter
export const errorCounter = {
  add: (count = 1) => {
    console.error(`Error occurred! Count: ${count}`);
  }
};

export function checkStatus(res, expectedStatus) {
  const success = check(res, {
    [`status is ${expectedStatus}`]: (r) => r.status === expectedStatus,
  });

  if (!success) {
    console.error(`Expected status ${expectedStatus} but got ${res.status}. Response: ${res.body}`);
    errorCounter.add(1);
  }

  return success;
}

export function randomSleep() {
  sleep(Math.random() * 2 + 1);
}