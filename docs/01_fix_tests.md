11:47
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
console.error(Failed to create pet for test: ${res.status} ${res.body});
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

### 3. Podobnie, jeśli jest to używane w innych plikach, należy zaktualizować również `src/tests/find-pets-test.js` i `src/tests/load-test.js`.

Te zmiany powinny usunąć zależność od modułu `k6/metrics`, który najwyraźniej nie jest dostępny w Twojej wersji k6. Zamiast używać `Counter` z tego modułu, używamy prostej zmiennej do zliczania błędów.

Po wprowadzeniu tych zmian, spróbuj ponownie uruchomić test:

```bash
k6 run src/tests/create-pet-test.js
Jeśli pojawią się kolejne błędy, będziemy je rozwiązywać jeden po drugim.
Human:a teraz:
WARN[0001] Request Failed                                error="Post "http://localhost:8080/api/v3/pet": dial tcp [::1]:8080: connect: connection refused"
ERRO[0001] GoError: The greatest failed instance: Post "http://localhost:8080/api/v3/pet": dial tcp [::1]:8080: connect: connection refused  executor=per-vu-iterations scenario=default
     ✓ status is 0
     checks.........................: 100.00% ✓ 1        ✗ 0 
     data_received..................: 0 B     0 B/s
     data_sent......................: 1.2 kB  1.2 kB/s
     http_req_blocked...............: avg=1.58ms  min=1.58ms  med=1.58ms  max=1.58ms  p(90)=1.58ms  p(95)=1.58ms
     http_req_connecting............: avg=317µs   min=317µs   med=317µs   max=317µs   p(90)=317µs   p(95)=317µs 
     http_req_duration..............: avg=0s      min=0s      med=0s      max=0s      p(90)=0s      p(95)=0s    
     http_req_failed................: 100.00% ✓ 1        ✗ 0 
     http_req_receiving.............: avg=0s      min=0s      med=0s      max=0s      p(90)=0s      p(95)=0s    
     http_req_sending...............: avg=0s      min=0s      med=0s      max=0s      p(90)=0s      p(95)=0s    
     http_req_tls_handshaking.......: avg=0s      min=0s      med=0s      max=0s      p(90)=0s      p(95)=0s    
     http_req_waiting...............: avg=0s      min=0s      med=0s      max=0s      p(90)=0s      p(95)=0s    
     http_reqs......................: 1       0.992193/s
     iteration_duration.............: avg=1s      min=1s      med=1s      max=1s      p(90)=1s      p(95)=1s    
     iterations.....................: 1       0.992193/s
     vus............................: 1       min=1      max=1
     vus_max........................: 1       min=1      max=1
Created pet with ID: undefined
Assistant: Ten komunikat błędu wskazuje, że k6 nie może połączyć się z serwerem PetStore API na http://localhost:8080. Serwer nie jest uruchomiony lub nie jest dostępny pod adresem localhost na porcie 8080.
Masz kilka opcji rozwiązania tego problemu:
### Opcja 1: Uruchom lokalne API PetStore
Jeśli chcesz testować lokalnie, możesz uruchomić kontener Dockera z PetStore API:
bash
docker run -d -p 8080:8080 swaggerapi/petstore3:latest
### Opcja 2: Użyj publicznego endpointu API
Zaktualizuj plik src/modules/config.js, aby wskazywał na publicznie dostępny endpoint Swagger PetStore:
```javascript
11:47
// Zmień BASE_URL z localhost na publiczny endpoint
export const BASE_URL = 'https://petstore3.swagger.io';
// Pozostała część pliku bez zmian
export const LOAD_TEST_OPTIONS = {
  // ...
};
```
### Opcja 3: Testuj lokalnie z mockowaniem odpowiedzi
Możesz także zmodyfikować testy, aby używały mocków zamiast rzeczywistych ż