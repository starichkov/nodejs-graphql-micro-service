import { GenericContainer, Wait } from 'testcontainers';
import mongoose from 'mongoose';
import { startServer } from '../src/index.js';
import connectDB from '../src/db.js';

/**
 * Integration Tests for the Computer Parts Shop GraphQL API.
 * We use Testcontainers to spin up a real MongoDB instance in a Docker container.
 * This ensures our tests are isolated, reproducible, and run against a real database.
 */
describe('GraphQL API Integration Tests', () => {
  let mongodbContainer;
  let server;
  let url;

  // Set a longer timeout for Testcontainers to pull the image and start
  const TIMEOUT = 120000;

  /**
   * Before all tests, we start a MongoDB container and then start our Apollo Server.
   */
  beforeAll(async () => {
    // 1. Start MongoDB Container using GenericContainer for simplicity
    mongodbContainer = await new GenericContainer('mongo:latest')
      .withExposedPorts(27017)
      .withWaitStrategy(Wait.forListeningPorts())
      .start();
    
    const host = mongodbContainer.getHost();
    const port = mongodbContainer.getMappedPort(27017);
    const mongodbUri = `mongodb://${host}:${port}/test-db`;

    // 2. Start our Apollo Server pointing to the containerized MongoDB
    // We pass port: 4001 or something to cover the port branch, 
    // but better to keep 0 for random port and cover branches elsewhere if needed.
    const result = await startServer({ port: 0, mongodbUri });
    server = result.server;
    url = result.url;
  }, TIMEOUT);

  /**
   * After all tests, we shut down the Apollo Server and the MongoDB container.
   */
  afterAll(async () => {
    if (server) {
      await server.stop();
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongodbContainer) {
      await mongodbContainer.stop();
    }
  }, TIMEOUT);

  /**
   * Helper function to send GraphQL requests using fetch.
   */
  const graphqlRequest = async (query, variables = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });
    return {
      status: response.status,
      body: await response.json(),
    };
  };

  describe('GraphQL API', () => {
    it('should add a new part and then fetch it', async () => {
    // 1. Define the mutation to add a part
    const addPartMutation = `
      mutation AddPart($name: String!, $category: String!, $price: Float!, $stock: Int!, $description: String) {
        addPart(name: $name, category: $category, price: $price, stock: $stock, description: $description) {
          id
          name
          category
          price
          stock
        }
      }
    `;
    const variables = {
      name: 'Test Processor',
      category: 'CPU',
      price: 299.99,
      stock: 10,
      description: 'A powerful test CPU'
    };

    // 2. Execute the mutation
    const { status, body } = await graphqlRequest(addPartMutation, variables);

    expect(status).toBe(200);
    const addedPart = body.data.addPart;
    expect(addedPart.name).toBe('Test Processor');
    expect(addedPart.category).toBe('CPU');

    // 3. Define the query to fetch all parts
    const getPartsQuery = `
      query GetParts {
        parts {
          id
          name
          category
          price
        }
      }
    `;

    // 4. Execute the query
    const getResponse = await graphqlRequest(getPartsQuery);

    expect(getResponse.status).toBe(200);
    const parts = getResponse.body.data.parts;
    expect(Array.isArray(parts)).toBe(true);
    expect(parts.some(p => p.id === addedPart.id)).toBe(true);

    // 5. Fetch a single part by ID
    const getPartQuery = `
      query GetPart($id: ID!) {
        part(id: $id) {
          id
          name
        }
      }
    `;
    const singleResult = await graphqlRequest(getPartQuery, { id: addedPart.id });
    expect(singleResult.status).toBe(200);
    expect(singleResult.body.data.part.name).toBe('Test Processor');
  });

  it('should update an existing part', async () => {
    // 1. Add a part first
    const addPartMutation = `
      mutation AddPart($name: String!, $category: String!, $price: Float!, $stock: Int!, $description: String) {
        addPart(name: $name, category: $category, price: $price, stock: $stock, description: $description) {
          id
        }
      }
    `;
    const addResult = await graphqlRequest(addPartMutation, {
      name: 'To Be Updated',
      category: 'GPU',
      price: 500,
      stock: 5
    });
    const partId = addResult.body.data.addPart.id;

    // 2. Update it
    const updatePartMutation = `
      mutation UpdatePart($id: ID!, $name: String, $price: Float) {
        updatePart(id: $id, name: $name, price: $price) {
          id
          name
          price
        }
      }
    `;
    const updateVariables = {
      id: partId,
      name: 'Updated GPU',
      price: 450.99
    };
    const { status, body } = await graphqlRequest(updatePartMutation, updateVariables);

    expect(status).toBe(200);
    expect(body.data.updatePart.name).toBe('Updated GPU');
    expect(body.data.updatePart.price).toBe(450.99);
  });

  it('should remove a part', async () => {
    // 1. Add a part first
    const addPartMutation = `
      mutation AddPart($name: String!, $category: String!, $price: Float!, $stock: Int!, $description: String) {
        addPart(name: $name, category: $category, price: $price, stock: $stock, description: $description) {
          id
        }
      }
    `;
    const addResult = await graphqlRequest(addPartMutation, {
      name: 'To Be Removed',
      category: 'RAM',
      price: 100,
      stock: 20
    });
    const partId = addResult.body.data.addPart.id;

    // 2. Remove it
    const removePartMutation = `
      mutation RemovePart($id: ID!) {
        removePart(id: $id) {
          id
          name
        }
      }
    `;
    const { status, body } = await graphqlRequest(removePartMutation, { id: partId });

    expect(status).toBe(200);
    expect(body.data.removePart.name).toBe('To Be Removed');

    // 3. Verify it's gone
    const getPartQuery = `
      query GetPart($id: ID!) {
        part(id: $id) {
          id
        }
      }
    `;
    const getResult = await graphqlRequest(getPartQuery, { id: partId });
    expect(getResult.body.errors[0].message).toContain('Part not found');
  });

  it('should return error when fetching a non-existent part', async () => {
    const getPartQuery = `
      query GetPart($id: ID!) {
        part(id: $id) {
          id
          name
        }
      }
    `;
    const variables = {
      id: new mongoose.Types.ObjectId().toString()
    };

    const { status, body } = await graphqlRequest(getPartQuery, variables);

    expect(status).toBe(200); // GraphQL usually returns 200 even for business errors
    expect(body.errors).toBeDefined();
    expect(body.errors[0].message).toContain('Part not found');
  });

  it('should return error when updating a non-existent part', async () => {
    const updatePartMutation = `
      mutation UpdatePart($id: ID!, $name: String) {
        updatePart(id: $id, name: $name) {
          id
        }
      }
    `;
    const variables = {
      id: new mongoose.Types.ObjectId().toString(),
      name: 'Non-existent'
    };

    const { body } = await graphqlRequest(updatePartMutation, variables);
    expect(body.errors[0].message).toContain('Part not found');
  });

  it('should return error when removing a non-existent part', async () => {
    const removePartMutation = `
      mutation RemovePart($id: ID!) {
        removePart(id: $id) {
          id
        }
      }
    `;
    const variables = {
      id: new mongoose.Types.ObjectId().toString()
    };

    const { body } = await graphqlRequest(removePartMutation, variables);
    expect(body.errors[0].message).toContain('Part not found');
  });

  it('should return error when adding a part with invalid data', async () => {
    const addPartMutation = `
      mutation AddPart($name: String!, $category: String!, $price: Float!, $stock: Int!) {
        addPart(name: $name, category: $category, price: $price, stock: $stock) {
          id
        }
      }
    `;
    // Price cannot be negative (assuming mongoose validation if we had it, but let's check what we have)
    // Actually, I don't have explicit validation in Part.js besides types and required fields.
    // Let's check Part.js
    const variables = {
      name: '', // Should be required
      category: 'INVALID', // It's an enum
      price: -1,
      stock: -1
    };

    const { body } = await graphqlRequest(addPartMutation, variables);
    expect(body.errors).toBeDefined();
  });
});
});
