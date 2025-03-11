import http from 'k6/http';
import { check, sleep } from 'k6';
import { checkStatus, errorCounter } from '../modules/helpers.js';
import { BASE_URL } from '../modules/config.js';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '30s', target: 10 },
    { duration: '10s', target: 0 }
  ]
};

// Najpierw utworzymy peta, a następnie go pobierzemy
export function setup() {
  const pet = {
    id: 0,
    name: `TestPet_${Date.now()}`, // Dodane backticki zamiast ${} bez backticks
    category: { id: 1, name: "Dogs" },
    photoUrls: ["https://example.com/test.jpg"],
    tags: [{ id: 1, name: "test" }],
    status: "available"
  };

  const res = http.post(`${BASE_URL}/api/v3/pet`, JSON.stringify(pet), { // Dodane backticki
    headers: { 'Content-Type': 'application/json' },
  });

  const success = check(res, {
    'pet created successfully': (r) => r.status === 200,
  });

  if (!success) {
    errorCounter.add(1);
    return { petId: 1 };  // Fallback ID if creation fails
  }

  return {
    petId: JSON.parse(res.body).id
  };
}

export default function(data) {
  // Pobieramy peta po ID
  const res = http.get(`${BASE_URL}/api/v3/pet/${data.petId}`); // Dodane backticki

  // Sprawdzamy status odpowiedzi
  checkStatus(res, 200);

  // Sprawdzamy czy ID się zgadza
  check(res, {
    'correct pet ID': (r) => JSON.parse(r.body).id === data.petId,
  });

  sleep(1);
}