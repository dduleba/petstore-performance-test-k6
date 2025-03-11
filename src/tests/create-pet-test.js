import http from 'k6/http';
import { sleep } from 'k6';
import { checkStatus, randomSleep } from '../modules/helpers.js';
import { BASE_URL, LOAD_TEST_OPTIONS } from '../modules/config.js';

// Importujemy dane testowe - poprawiony import
const petsData = JSON.parse(open('../data/pets.json'));

export const options = LOAD_TEST_OPTIONS;

// Funkcja do wyboru losowego elementu z tablicy
function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export default function() {
  // Wybieramy losowego peta z danych testowych
  const pet = JSON.parse(JSON.stringify(randomItem(petsData)));

  // Ustawiamy unikalną nazwę dla każdego uruchomienia
  pet.name = `${pet.name}_${Date.now()}_${__VU}`;

  // Wysyłamy żądanie POST do utworzenia peta
  const res = http.post(`${BASE_URL}/api/v3/pet`, JSON.stringify(pet), {
    headers: { 'Content-Type': 'application/json' },
  });

  // Sprawdzamy status odpowiedzi
  const success = checkStatus(res, 200);

  if (success) {
    const petId = JSON.parse(res.body).id;
    console.log(`Created pet with ID: ${petId}`);
  }

  sleep(1 + Math.random());  // Prostsza wersja randomSleep
}