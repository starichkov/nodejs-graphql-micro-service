[![Author](https://img.shields.io/badge/Author-Vadim%20Starichkov-blue?style=for-the-badge)](https://github.com/starichkov)
[![GitHub License](https://img.shields.io/github/license/starichkov/nodejs-graphql-micro-service?style=for-the-badge)](https://github.com/starichkov/nodejs-graphql-micro-service/blob/main/LICENSE.md)

# Computer Parts Shop - GraphQL Micro-service

This project is a showcase of a standard way to implement a micro-service using Node.js, GraphQL, and MongoDB, themed as a Computer Parts Shop. It is designed to be educational, with clear code structure and comprehensive documentation.

## Features

- **Node.js**: Modern JavaScript runtime (using ES Modules).
- **GraphQL**: Flexible API query language using Apollo Server.
- **MongoDB**: NoSQL database for data persistence.
- **Mongoose**: Elegant MongoDB object modeling for Node.js.
- **Docker**: Containerized environment for easy deployment and development.
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

## Project Structure

- `src/index.js`: Entry point of the application.
- `src/db.js`: Database connection logic.
- `src/schema.graphql`: GraphQL schema definition in its native format.
- `src/schema.js`: Utility to load the GraphQL schema file.
- `src/resolvers.js`: GraphQL resolvers (business logic).
- `src/models/`: Mongoose models for MongoDB.
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

- **Separation of Concerns**: The project is structured to separate data modeling (Mongoose), API definitions (GraphQL Schema), and business logic (Resolvers).
- **Native GraphQL Files**: The schema is stored in a `.graphql` file rather than a JavaScript string. This provides better readability, syntax highlighting in IDEs, and a clear separation between code and API definitions.
- **Environment Configuration**: We use `dotenv` to manage configuration via environment variables, which is a best practice for micro-services.
- **Containerization**: The `Dockerfile` and `docker-compose.yml` provide a reproducible environment, ensuring the service runs the same way everywhere.
- **Git and Environment Hygiene**: We use `.gitignore` to keep the repository clean of dependencies, environment secrets, and IDE-specific files. The `.env.example` file provides a safe template for others to set up their environment without exposing sensitive data.
