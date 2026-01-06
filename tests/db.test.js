import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import mongoose from 'mongoose';
import connectDB from '../src/db.js';

describe('Database Connection', () => {
  let connectSpy;

  beforeEach(() => {
    connectSpy = jest.spyOn(mongoose, 'connect');
    // Mock successful connection by default
    connectSpy.mockResolvedValue(mongoose);
  });

  afterEach(() => {
    connectSpy.mockRestore();
    delete process.env.MONGODB_URI;
  });

  it('should connect successfully with provided URI', async () => {
    const uri = 'mongodb://localhost:27017/test-db';
    await connectDB(uri);
    expect(connectSpy).toHaveBeenCalledWith(uri);
  });

  it('should use MONGODB_URI from environment if no URI is provided', async () => {
    const envUri = 'mongodb://env-host:27017/env-db';
    process.env.MONGODB_URI = envUri;
    await connectDB();
    expect(connectSpy).toHaveBeenCalledWith(envUri);
  });

  it('should use default URI if no URI is provided and MONGODB_URI is not set', async () => {
    delete process.env.MONGODB_URI;
    await connectDB();
    expect(connectSpy).toHaveBeenCalledWith('mongodb://localhost:27017/computer-parts-shop');
  });

  it('should throw and log error when connection fails', async () => {
    const errorMessage = 'Connection failed';
    connectSpy.mockRejectedValue(new Error(errorMessage));
    
    // Mock console.error to avoid cluttering test output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    await expect(connectDB('mongodb://invalid')).rejects.toThrow(errorMessage);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Error connecting to MongoDB:'), errorMessage);
    
    consoleSpy.mockRestore();
  });
});
