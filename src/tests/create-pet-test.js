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
