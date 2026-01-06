import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import connectDB from './db.js';
import { typeDefs } from './schema.js';
import { resolvers } from './resolvers.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
dotenv.config();

/**
 * Apollo Server initialization.
 * The server takes the type definitions and resolvers we defined.
 */
export const createServer = () => new ApolloServer({
  typeDefs,
  resolvers,
});

/**
 * Start the standalone server.
 * In a micro-service architecture, the port is usually configurable via environment variables.
 * @param {Object} [options] - Start options
 * @param {number} [options.port] - Port to listen on
 * @param {string} [options.mongodbUri] - MongoDB URI to connect to
 */
export const startServer = async (options = {}) => {
  // Connect to MongoDB before starting the server
  await connectDB(options.mongodbUri);

  const server = createServer();

  const port = options.port !== undefined ? options.port : (process.env.PORT || 4000);
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(port) },
  });

  console.log(`🚀  Server ready at: ${url}`);
  return { url, server };
};

// Start the server if this file is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
