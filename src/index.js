import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import connectDB from './db.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Apollo Server initialization.
 * The server takes the type definitions and resolvers we defined.
 */
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

/**
 * Start the standalone server.
 * In a micro-service architecture, the port is usually configurable via environment variables.
 */
const startServer = async () => {
  // Connect to MongoDB before starting the server
  await connectDB();

  const port = process.env.PORT || 4000;
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(port) },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

startServer();
