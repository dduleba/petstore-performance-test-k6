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
