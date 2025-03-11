export const BASE_URL = 'http://localhost:8080';
export const LOAD_TEST_OPTIONS = {
  stages: [
    { duration: '30s', target: 20 },  // Ramp up do 20 użytkowników w 30s
    { duration: '1m', target: 20 },   // Utrzymaj 20 użytkowników przez 1 minutę
    { duration: '30s', target: 0 }    // Ramp down do 0 w 30s
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],   // 95% żądań poniżej 500ms
    'http_req_failed': ['rate<0.01']      // Mniej niż 1% błędów
  }
};
export const STRESS_TEST_OPTIONS = {
  stages: [
    { duration: '1m', target: 50 },    // Ramp up do 50 użytkowników w 1 minutę
    { duration: '2m', target: 50 },    // Utrzymaj 50 użytkowników przez 2 minuty
    { duration: '1m', target: 100 },   // Ramp up do 100 użytkowników w 1 minutę
    { duration: '2m', target: 100 },   // Utrzymaj 100 użytkowników przez 2 minuty
    { duration: '1m', target: 0 }      // Ramp down do 0 w 1 minutę
  ],
  thresholds: {
    'http_req_duration': ['p(95)<1000'], // 95% żądań poniżej 1s
    'http_req_failed': ['rate<0.05']     // Mniej niż 5% błędów
  }
};
