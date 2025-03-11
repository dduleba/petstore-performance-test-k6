import http from 'k6/http';
import { group, sleep } from 'k6';

import createPetTest from './create-pet-test.js';
import getPetTest from './get-pet-test.js';
import findPetsTest from './find-pets-test.js';

// Konfiguracja dla wszystkich testów
export const options = {
    vus: 1,
    iterations: 1,
    thresholds: {
        http_req_duration: ['p(95)<3000'], // 95% żądań poniżej 3s
        http_req_failed: ['rate<0.05'],    // mniej niż 5% błędów
    },
};

const params = {
    timeout: '30s',
    insecureSkipTLSVerify: true,
    headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'k6-performance-test'
    }
};

// Nadpisuj domyślne opcje HTTP dla wszystkich żądań
http.setResponseCallback(http.expectedStatuses(200, 201, 202, 204));

// Funkcja testująca dostępność API (wykonaj przed innymi testami)
export function setup() {
    const testUrl = 'https://petstore.swagger.io/v2/pet/findByStatus?status=available';
    const res = http.get(testUrl);

    if (res.status != 200) {
        console.error(`API nie jest dostępne. Status: ${res.status}`);
        return { skip: true };
    }

    return { skip: false };
}

// Główna funkcja testowa
export default function(data) {
    if (data.skip) {
        console.log("Testy zostały pominięte ze względu na niedostępność API");
        return;
    }

    group('Create Pet Test', () => {
        createPetTest();
    });

    sleep(1);

    group('Get Pet Test', () => {
        // Używamy setupu z get-pet-test.js
        const setupData = getPetTest.setup ? getPetTest.setup() : {};
        getPetTest(setupData);
    });

    sleep(1);

    group('Find Pets Test', () => {
        findPetsTest();
    });
}