# Utworzenie repo dla testów wydajności z k6

a teraz poproszę o skrypt bash którym stworzę repozytorium z testami wydajnościowymi tylko że w narzędziu k6s

Huuuge AI
APP  29 minutes ago
Oto skrypt bash, który stworzy repozytorium z testami wydajnościowymi dla PetStore API przy użyciu narzędzia k6 (grafQL Inc.):
bash
#!/bin/bash

# Tworzymy katalog projektu
mkdir -p petstore-k6-performance-test
cd petstore-k6-performance-test

# Inicjalizacja git
git init

# Tworzymy strukturę katalogów
mkdir -p src/tests
mkdir -p src/modules
mkdir -p src/data

# Tworzymy plik README.md
cat > README.md << 'EOF'
# PetStore API Performance Tests

Testy wydajnościowe dla Swagger PetStore API przy użyciu k6.

## Wymagania

- [k6](https://k6.io/docs/getting-started/installation/)

## Uruchamianie testów

```bash
# Uruchomienie wszystkich testów
npm run test

# Uruchomienie konkretnego scenariusza
k6 run src/tests/create-pet-test.js
## Struktura projektu
- src/tests/ - Scenariusze testowe
- src/modules/ - Moduły pomocnicze i konfiguracje
- src/data/ - Dane testowe (JSON, CSV)
EOF
# Tworzymy plik package.json
cat > package.json << 'EOF'
{
  "name": "petstore-k6-performance-test",
  "version": "1.0.0",
  "description": "Performance tests for PetStore API using k6",
  "scripts": {
    "test": "k6 run src/tests/index.js",
    "test:create": "k6 run src/tests/create-pet-test.js",
    "test:get": "k6 run src/tests/get-pet-test.js",
    "test:find": "k6 run src/tests/find-pets-test.js",
    "test:load": "k6 run src/tests/load-test.js"
  },
  "keywords": [
    "k6",
    "performance",
    "api"
  ],
  "author": "",
  "license": "MIT"
}
EOF
# Tworzymy plik konfiguracyjny
cat > src/modules/config.js << 'EOF'
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
EOF
# Tworzymy moduł pomocniczy
cat > src/modules/helpers.js << 'EOF'
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
EOF
# Tworzenie przykładowych danych testowych
cat > src/data/pets.json << 'EOF'
[
  {
    "id": 0,
    "category": {
      "id": 1,
      "name": "Dogs"
    },
    "name": "Rex",
    "photoUrls": [
      "https://example.com/dog1.jpg"
    ],
    "tags": [
      {
        "id": 1,
        "name": "friendly"
      }
    ],
    "status": "available"
  },
  {
    "id": 0,
    "category": {
      "id": 2,
      "name": "Cats"
    },
    "name": "Whiskers",
    "photoUrls": [
      "https://example.com/cat1.jpg"
    ],
    "tags": [
      {
        "id": 2,
        "name": "playful"
      }
    ],
    "status": "available"
  },
  {
    "id": 0,
    "category": {
      "id": 3,
      "name": "Birds"
    },
    "name": "Tweety",
    "photoUrls": [
11:33
"https://example.com/bird1.jpg"
    ],
    "tags": [
      {
        "id": 3,
        "name": "vocal"
      }
    ],
    "status": "pending"
  }
]
EOF
# Tworzenie testów poszczególnych endpointów
cat > src/tests/create-pet-test.js << 'EOF'
import http from 'k6/http';
import { sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { checkStatus, randomSleep } from '../modules/helpers.js';
import { BASE_URL, LOAD_TEST_OPTIONS } from '../modules/config.js';
// Importujemy dane testowe
const pets = JSON.parse(open('../data/pets.json'));
export const options = LOAD_TEST_OPTIONS;
export default function() {
  // Wybieramy losowego peta z danych testowych
  const pet = randomItem(pets);
  // Ustawiamy unikalną nazwę dla każdego uruchomienia
  pet.name = ${pet.name}_${Date.now()}_${__VU};
  // Wysyłamy żądanie POST do utworzenia peta
  const res = http.post(${BASE_URL}/api/v3/pet, JSON.stringify(pet), {
    headers: { 'Content-Type': 'application/json' },
  });
  // Sprawdzamy status odpowiedzi
  const success = checkStatus(res, 200);
  if (success) {
    const petId = JSON.parse(res.body).id;
    console.log(Created pet with ID: ${petId});
  }
  randomSleep();
}
EOF
cat > src/tests/get-pet-test.js << 'EOF'
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
    name: TestPet_${Date.now()},
    category: { id: 1, name: "Dogs" },
    photoUrls: ["https://example.com/test.jpg"],
    tags: [{ id: 1, name: "test" }],
    status: "available"
  };
  const res = http.post(${BASE_URL}/api/v3/pet, JSON.stringify(pet), {
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
  const res = http.get(${BASE_URL}/api/v3/pet/${data.petId});
  // Sprawdzamy status odpowiedzi
  checkStatus(res, 200);
  // Sprawdzamy czy ID się zgadza
  check(res, {
    'correct pet ID': (r) => JSON.parse(r.body).id === data.petId,
  });
  sleep(1);
}
EOF
cat > src/tests/find-pets-test.js << 'EOF'
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
EOF
cat > src/tests/load-test.js << 'EOF'
import http from 'k6/http';
import { group, check, sleep } from 'k6';
import { randomItem } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';
import { checkStatus } from '../modules/helpers.js';
import { BASE_URL, STRESS_TEST_OPTIONS } from