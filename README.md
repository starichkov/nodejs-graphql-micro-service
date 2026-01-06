[![Author](https://img.shields.io/badge/Author-Vadim%20Starichkov-blue?style=for-the-badge)](https://github.com/starichkov)
[![GitHub License](https://img.shields.io/github/license/starichkov/nodejs-graphql-micro-service?style=for-the-badge)](https://github.com/starichkov/nodejs-graphql-micro-service/blob/main/LICENSE.md)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/starichkov/nodejs-graphql-micro-service/ci.yml?style=for-the-badge)](https://github.com/starichkov/nodejs-graphql-micro-service/actions/workflows/ci.yml)
[![Codecov](https://img.shields.io/codecov/c/github/starichkov/nodejs-graphql-micro-service?style=for-the-badge)](https://codecov.io/gh/starichkov/nodejs-graphql-micro-service)

# Computer Parts Shop - GraphQL Micro-service

This project is a showcase of a standard way to implement a micro-service using Node.js, GraphQL, and MongoDB, themed as a Computer Parts Shop. It is designed to be educational, with clear code structure and comprehensive documentation.

## Features

- **Node.js**: Modern JavaScript runtime (using ES Modules).
- **GraphQL**: Flexible API query language using Apollo Server.
- **MongoDB**: NoSQL database for data persistence.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Docker**: Containerized environment for easy deployment and development.
- **Testing**: Integration tests using [Testcontainers](https://testcontainers.com/) and [Jest](https://jestjs.io/).
- **CI/CD**: Automated testing with GitHub Actions across multiple Node.js versions.
- **Educational**: Code is thoroughly documented with comments explaining the "why" and "how".

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

### Running with Docker (Recommended)

The easiest way to get the service up and running is using Docker Compose.

1.  Clone the repository.
2.  Run the following command:
    ```bash
    docker-compose up --build
    ```
3.  The GraphQL server will be available at `http://localhost:4000/`.

### Running Locally

If you prefer to run it locally without Docker, you'll need a MongoDB instance running on your machine.

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file based on `.env.example` and update `MONGODB_URI` if necessary:
    ```bash
    cp .env.example .env
    ```
3.  Start the server:
    ```bash
    npm run dev
    ```

## Testing

The project includes both **unit** and **integration** tests to ensure high code quality and reliability.

### Integration Testing with Testcontainers
We use real MongoDB instances running in Docker containers for integration tests, thanks to **Testcontainers**. This ensures that the tests are as close to reality as possible, covering:
- Connecting to a containerized MongoDB.
- Starting the GraphQL server on a random port.
- Executing mutations to add, update, and remove data.
- Executing queries to fetch data and verifying the results.
- Handling of error scenarios (e.g., fetching non-existent items).

To run the tests, make sure you have Docker running and execute:
```bash
npm test
```

### Unit Testing
We also use unit tests with mocks (using Jest) to cover:
- Database connection branching and error handling (`tests/db.test.js`).
- Server startup configurations (`tests/index.test.js`).
- Business logic error handling in GraphQL resolvers (`tests/resolvers.test.js`).

### Code Coverage
We use Jest's built-in coverage tool to ensure our code is well-tested. We have set minimum coverage requirements (thresholds) to maintain high code quality:
- **Statements/Lines/Functions**: 80%
- **Branches**: 60%

To run tests with a coverage report:
```bash
npm run test:coverage
```
This will generate a `coverage/` directory with a detailed HTML report (available at `coverage/lcov-report/index.html`).

## Project Structure

- `src/index.js`: Entry point of the application, handles server startup.
- `src/db.js`: Database connection logic.
- `src/schema.graphql`: GraphQL schema definition.
- `src/schema.js`: Utility to load the GraphQL schema file.
- `src/resolvers.js`: GraphQL resolvers (business logic).
- `src/models/`: Mongoose models for MongoDB.
- `tests/`: Test suite containing both unit and integration tests.
- `.gitignore`: Specifies intentionally untracked files that Git should ignore.
- `.env.example`: A template for environment variables.

## API Documentation

Once the server is running, you can access the Apollo Sandbox at `http://localhost:4000/` to explore the schema and run queries/mutations.

### Example Queries

#### Add a Computer Part
```graphql
mutation AddPart($name: String!, $category: String!, $price: Float!, $stock: Int!, $description: String) {
  addPart(name: $name, category: $category, price: $price, stock: $stock, description: $description) {
    id
    name
    category
    price
    stock
  }
}
```

#### Fetch All Parts
```graphql
query GetParts {
  parts {
    id
    name
    category
    price
    stock
    createdAt
  }
}
```

## Educational Notes

- **Comprehensive Testing Strategy**: We use a combination of unit and integration tests. While integration tests with Testcontainers provide the highest confidence, unit tests allow us to easily cover edge cases and error handling paths that are difficult to trigger in a real environment.
- **Separation of Concerns**: The project is structured to separate data modeling (Mongoose), API definitions (GraphQL Schema), and business logic (Resolvers).
- **Native GraphQL Files**: The schema is stored in a `.graphql` file rather than a JavaScript string for better readability and IDE support.
- **Environment Configuration**: We use `dotenv` to manage configuration via environment variables.
- **Containerization**: The `Dockerfile` and `docker-compose.yml` provide a reproducible environment.
- **Code Coverage Thresholds**: We enforce minimum coverage requirements to ensure that new changes don't lower the quality of our testing.
- **Continuous Integration (CI)**: We use GitHub Actions to automatically run our test suite on every push and pull request. This ensures that new changes don't break existing functionality and that the code meets our coverage thresholds across all supported Node.js LTS versions.
- **Code Coverage Reporting**: We push our coverage reports to Codecov from our CI pipeline. This allows us to track coverage over time and visualize which parts of the codebase are tested. We only push coverage from the latest Node.js LTS version (v24) to avoid redundant uploads and maintain a consistent "main" report.
