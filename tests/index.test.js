import { jest, describe, it, expect, afterEach } from '@jest/globals';
import mongoose from 'mongoose';

// Mock connectDB to avoid actual database connection
jest.unstable_mockModule('../src/db.js', () => ({
  default: jest.fn().mockResolvedValue(undefined)
}));

// We need to use dynamic import after mocking
const { startServer } = await import('../src/index.js');

describe('Server Entry Point', () => {
  let activeServers = [];

  afterEach(async () => {
    for (const s of activeServers) {
      await s.stop();
    }
    activeServers = [];
    // Clean up mongoose just in case
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    delete process.env.PORT;
  });

  it('should start the server with provided port', async () => {
    // We use a real server but on a random port to avoid conflicts
    const result = await startServer({ port: 0 });
    activeServers.push(result.server);
    expect(result.url).toContain('http://localhost:');
    expect(result.server).toBeDefined();
  });

  it('should use PORT from environment if no port is provided', async () => {
    // Since we are running in the same process, we might have issues if 4005 is used
    process.env.PORT = '4005';
    const result = await startServer({});
    activeServers.push(result.server);
    expect(result.url).toContain(':4005/');
  });

  it('should use default port 4000 if no port or PORT env is provided', async () => {
    delete process.env.PORT;
    // This might fail if 4000 is already in use by another test suite
    // but let's see.
    try {
        const result = await startServer({});
        activeServers.push(result.server);
        expect(result.url).toContain(':4000/');
    } catch (e) {
        if (e.code === 'EADDRINUSE') {
            console.warn('Port 4000 is in use, skipping default port test');
        } else {
            throw e;
        }
    }
  });
});
