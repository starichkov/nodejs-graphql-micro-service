import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * GraphQL Type Definitions (Schema).
 * We read the schema from a dedicated .graphql file for better readability and syntax highlighting.
 */
export const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');
