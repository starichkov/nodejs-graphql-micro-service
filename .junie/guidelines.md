# Project Guidelines

This project is a micro-service implemented using **Node.js**, **GraphQL**, and **MongoDB**, themed as a Computer Parts Shop.

## Project Structure

- `src/`: Main application source code.
  - `index.js`: Entry point, handles server startup and Apollo Server configuration.
  - `db.js`: Database connection logic using Mongoose.
  - `schema.graphql`: GraphQL schema definition in native SDL format.
  - `schema.js`: Utility to load the `.graphql` schema file.
  - `resolvers.js`: GraphQL resolvers containing the business logic.
  - `models/`: Mongoose models for MongoDB (e.g., `Part.js`).
- `tests/`: Test suite containing both unit and integration tests.
  - `db.test.js`: Unit tests for database connection logic.
  - `index.test.js`: Unit tests for server startup.
  - `resolvers.test.js`: Unit tests for resolver business logic.
  - `integration.test.js`: Integration tests using Testcontainers.
- `docs/`: Supplementary documentation (tutorials) in Markdown format.
- `scripts/`: Utility scripts for development and documentation.
  - `fix-docs-title.js`: Customizes JSDoc output titles.
- `Dockerfile` & `docker-compose.yml`: Containerization configuration.
- `jsdoc.json`: Configuration for JSDoc documentation generation.

## Testing Guidelines

- **Always run tests** before submitting changes to ensure no regressions.
- **Test Command**: Use `npm test` to run the full test suite.
- **Integration Tests**: The project uses **Testcontainers for Node.js** to run integration tests against a real MongoDB instance. Ensure Docker is running when executing tests.
- **Code Coverage**: We aim for high code coverage. 
  - Minimum thresholds: 80% for Statements/Lines/Functions, 60% for Branches.
  - Run `npm run test:coverage` to check coverage locally.
- **New Features/Fixes**: Always include corresponding tests (unit or integration) for any new logic or bug fixes.

## Development and Build

- **Node.js Version**: The project requires Node.js v20 or higher (ES Modules).
- **Local Development**: Use `npm run dev` to start the server with `nodemon` for automatic restarts.
- **Production Start**: Use `npm start` to run the application in production mode.
- **Docker**: Use `docker-compose up --build` to run the entire stack (App + MongoDB).
- **Environment Variables**: Use a `.env` file (see `.env.example`) for configuration like `MONGODB_URI` and `PORT`.

## Documentation

- **JSDoc**: Use JSDoc for documenting JavaScript files.
- **Generation**: Use `npm run docs` to generate the documentation.
  - This runs JSDoc based on `jsdoc.json` and then executes `scripts/fix-docs-title.js`.
  - Output is generated in the `out-docs/` directory.
- **Tutorials**: The `docs/` folder contains Markdown files that are included as tutorials in the generated JSDoc.
- **Deployment**: Documentation is automatically deployed to GitHub Pages when changes are pushed to `main` branch (triggered by changes in `docs/**`, `README.md`, or the workflow file).

## CI/CD

- **GitHub Actions**: 
  - `ci.yml`: Runs tests on every push and pull request to `main` for Node.js versions 20, 22, and 24.
  - `deploy-docs.yml`: Deploys generated documentation to GitHub Pages.
- **Code Coverage**: Coverage reports are uploaded to Codecov for Node.js v24 builds.

## Coding Standards

- **ES Modules**: Use native ES Modules (import/export).
- **JSDoc**: Document functions and complex logic using JSDoc.
- **GraphQL Schema**: Keep the schema in `src/schema.graphql`.
- **Naming Conventions**: Follow existing patterns (e.g., camelCase for variables/functions, PascalCase for Models).
