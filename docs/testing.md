# Testing Strategy

Quality is a first-class citizen in this project. We employ a multi-layered testing strategy to ensure that our micro-service is reliable and behaves as expected.

## 1. Unit Testing
Unit tests focus on individual components in isolation, often using mocks to replace external dependencies.
- **Framework**: [Jest](https://jestjs.io/)
- **Target Areas**:
    - **Resolvers**: We mock the Mongoose models to test business logic and error handling in our GraphQL resolvers (`tests/resolvers.test.js`).
    - **Database Logic**: We mock Mongoose to test the connection utility's URI fallback and error handling paths (`tests/db.test.js`).
    - **Server Config**: We test that the server starts correctly with various port configurations (`tests/index.test.js`).

## 2. Integration Testing with Testcontainers
Integration tests verify that different parts of the system work together correctly, including real external dependencies like the database.
- **Library**: [Testcontainers for Node.js](https://node.testcontainers.org/)
- **How it works**:
    1. A real MongoDB container is started automatically before the tests begin.
    2. The Apollo Server is started and connected to this containerized database.
    3. We use the native Node.js `fetch` API to send real GraphQL requests to the server.
    4. We verify the responses and the state of the database.
    5. The container is automatically cleaned up after the tests finish.
- **File**: `tests/integration.test.js`

## 3. Code Coverage
We use Jest's built-in coverage tool to track how much of our code is exercised by tests.
- **Requirements**: We enforce minimum coverage thresholds in `package.json`:
    - **Statements/Lines/Functions**: 80%
    - **Branches**: 60%
- **Reporting**: Detailed HTML reports are generated in the `coverage/` directory after running `npm run test:coverage`.

## Running Tests
To execute the full test suite:
```bash
npm test
```

To run tests with a coverage report:
```bash
npm run test:coverage
```

## Why this strategy?
- **Confidence**: Integration tests provide high confidence that the API works correctly from the user's perspective.
- **Speed & Edge Cases**: Unit tests are fast and allow us to easily test error paths (like a database connection failure) that are difficult to reproduce with real infrastructure.
- **Sustainability**: Enforcing coverage thresholds ensures that new features are tested and that code quality doesn't degrade over time.
