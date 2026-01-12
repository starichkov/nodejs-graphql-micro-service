# Architecture & Project Structure

This micro-service follows a clean and modular architecture, separating concerns into distinct layers. This makes the codebase easier to maintain, test, and scale.

## Directory Structure

```text
.
├── .github/             # GitHub specific configurations (Workflows, Funding)
├── docs/                # Project documentation (this site)
├── src/                 # Source code
│   ├── models/          # Data models (Mongoose schemas)
│   ├── db.js            # Database connection logic
│   ├── index.js         # Entry point and server initialization
│   ├── resolvers.js     # GraphQL resolvers (business logic)
│   ├── schema.graphql   # GraphQL type definitions (SDL)
│   └── schema.js        # Utility to load the schema file
├── tests/               # Test suite
│   ├── db.test.js       # Unit tests for database logic
│   ├── index.test.js    # Unit tests for server startup
│   ├── resolvers.test.js# Unit tests for resolvers
│   └── integration.test.js # Integration tests with Testcontainers
├── Dockerfile           # Docker image definition
├── docker-compose.yml   # Local development orchestration
└── package.json         # Dependencies and scripts
```

## Key Design Patterns

### 1. Separation of Concerns
We separate our API definition from its implementation:
- **Schema (`schema.graphql`)**: Defines *what* data can be queried.
- **Resolvers (`resolvers.js`)**: Defines *how* that data is fetched.
- **Models (`models/`)**: Defines the *structure* of the data in the database.

### 2. Dependency Injection (Lightweight)
Our `startServer` function in `src/index.js` and `connectDB` in `src/db.js` accept configuration options. This allows us to easily inject different settings (like database URIs or ports) during testing, without relying on global state or environment variables alone.

### 3. Error Handling
We use a centralized error handling approach in our resolvers, catching database errors and re-throwing them as meaningful GraphQL errors. This ensures that the API consumer receives helpful information while keeping the server stable.

### 4. Containerization
By using [Docker](https://www.docker.com/), we ensure that the application runs identically in development, testing, and production. The `docker-compose.yml` file allows developers to spin up the entire stack (App + MongoDB) with a single command.

## ES Modules
The project uses native **Node.js ES Modules** (`import`/`export`) instead of CommonJS (`require`). This is the modern standard for JavaScript development. To support this:
- `"type": "module"` is set in `package.json`.
- File extensions (like `.js`) are required in import statements.
- `__dirname` and `__filename` are derived using `fileURLToPath` and `url`.
