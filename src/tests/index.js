import http from 'k6/http';
import { check, group, sleep } from 'k6';

// Bazowy URL do API
const BASE_URL = 'http://localhost:8080';


export const options = {
    scenarios: {
        load_test: {
            executor: 'ramping-vus',
            startVUs: 1,
            stages: [
                { duration: '30s', target: 5 },
                { duration: '1m', target: 10 },
                { duration: '30s', target: 0 }
            ],
            gracefulRampDown: '10s'
        }
    }
};


export default function() {
    // Test 1: Create pet
    group('Create Pet Test', function() {
        const pet = {
            id: Math.floor(Math.random() * 10000),
            name: "TestDog_" + Date.now() + "_" + Math.floor(Math.random() * 10000),
            category: { id: Math.floor(Math.random() * 10000), name: "Dogs" },
            photoUrls: ["https://example.com/dog.jpg"],
            tags: [{ id: Math.floor(Math.random() * 10000), name: "test" }],
            status: "available"
        };

        const createRes = http.post(BASE_URL + "/api/v3/pet", JSON.stringify(pet), {
            headers: { 'Content-Type': 'application/json' },
        });

        check(createRes, {
            'status is 200': (r) => r.status === 200,
        });

        if (createRes.status !== 200) {
            console.log("Create Pet Error: " + createRes.body);
        }

        let petId = 1; // Domyślne ID

        try {
            const body = JSON.parse(createRes.body);
            if (body.id) {
                petId = body.id;
                console.log("Created pet with ID: " + petId);
            }
        } catch (e) {
            console.log("Error parsing response: " + e.message);
        }

        sleep(1);

        // Test 2: Get pet
        group('Get Pet Test', function() {
            const getRes = http.get(BASE_URL + "/api/v3/pet/" + petId);

            check(getRes, {
                'status is 200': (r) => r.status === 200,
            });
        });

        sleep(1);

        // Test 3: Find pets
        group('Find Pets Test', function() {
            const findRes = http.get(BASE_URL + "/api/v3/pet/findByStatus?status=available");

            check(findRes, {
                'status is 200': (r) => r.status === 200,
                'response is array': (r) => {
                    try {
                        return Array.isArray(JSON.parse(r.body));
                    } catch (e) {
                        return false;
                    }
                },
            });
        });
    });
}