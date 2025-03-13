# PetStore API Performance Tests

Testy wydajnościowe dla Swagger PetStore API przy użyciu k6

a potrzeby prezentacji korzystamy z aplikacji
https://github.com/swagger-api/swagger-petstore
https://petstore3.swagger.io/

Przed rozpoczęciem testów startujemy aplikacje:

```shell
docker pull swaggerapi/petstore3:unstable
docker run  --name swaggerapi-petstore3 -d -p 8080:8080 swaggerapi/petstore3:unstable
```

- testy wygenerowane na podstawie dyskusji z AI na podstawie kontynując wątek z [petstore-performance-test-gatling](https://github.com/dduleba/petstore-performance-test-gatling/tree/main)

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
```

## tworzenie testów z AI


[stworzenie repozytorium](docs/00_create_repo.md)

[próba uruchomienia testów](docs/00_run_tests.md)

[pierwsze poprawki w tescie](docs/01_fix_tests.md)

[pierwszy run testów](docs/01_run_tests.md)

