# CRUD App tested with Cypress

API: https://docs.cypress.io/api/api/table-of-contents.html

Tutorial: https://docs.cypress.io/examples/examples/tutorials.html#1-Project-setup

## How to run this repo and tests

1. Clone the repository
2. Run `npm i` to install the dependencies
3. Use node v8.17.0 (JSON server is compatible with this version)
4. Run the app with `npm run dev` and visit localhost:3030
5. Run the test GUI with `npm run cypress` or in terminal with `npm run cypress:all`

## About tests

- All tests can be found in /cypress/integration

- Integration tests use starting mock data in /cypress/fixtures

- Smoke (e2e) tests use JSON server (full fake REST API); starting data is placed in db.json