# GraphQL API Guide

This service provides a GraphQL API to manage a computer parts catalog. It uses [Apollo Server](https://www.apollographql.com/docs/apollo-server/) for the implementation.

## Schema Definition

The schema is defined in `src/schema.graphql` using the [Schema Definition Language (SDL)](https://graphql.org/learn/schema/). This approach provides several benefits:
- **Readability**: The schema is easy to read and understand.
- **Tooling**: IDEs can provide syntax highlighting and autocompletion.
- **Versioning**: Changes to the API are easily tracked in Git.

## Types

### Part
Represents a computer part in the catalog.

- `id`: Unique identifier (UUID).
- `name`: Name of the part.
- `category`: Category (e.g., CPU, GPU, RAM).
- `price`: Price in USD.
- `stock`: Current quantity in stock.
- `description`: Optional detailed description.
- `createdAt`: Timestamp when the part was added.

## Operations

### Queries

#### `parts: [Part]`
Fetches all computer parts from the database.

#### `part(id: ID!): Part`
Fetches a single computer part by its unique ID.

### Mutations

#### `addPart(name, category, price, stock, description): Part`
Adds a new computer part to the catalog.

#### `updatePart(id, name, category, price, stock, description): Part`
Updates an existing computer part. Only provide the fields you wish to change.

#### `removePart(id): Part`
Deletes a computer part from the database and returns the deleted item.

## Interactive Explorer

When running the service locally (or in Docker), you can access the **Apollo Sandbox** at:
`http://localhost:4000/`

This interactive tool allows you to:
- Browse the full schema documentation.
- Build and execute queries and mutations.
- View real-time responses from the API.
