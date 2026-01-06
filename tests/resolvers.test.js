import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { resolvers } from '../src/resolvers.js';
import Part from '../src/models/Part.js';

describe('GraphQL Resolvers', () => {
  describe('Query.parts', () => {
    it('should throw error when Part.find() fails', async () => {
      const errorMessage = 'Database error';
      const spy = jest.spyOn(Part, 'find').mockRejectedValue(new Error(errorMessage));
      
      await expect(resolvers.Query.parts()).rejects.toThrow('Error fetching parts: ' + errorMessage);
      
      spy.mockRestore();
    });
  });

  describe('Query.part', () => {
    it('should throw error when Part.findById() fails', async () => {
      const errorMessage = 'Database error';
      const spy = jest.spyOn(Part, 'findById').mockRejectedValue(new Error(errorMessage));
      
      await expect(resolvers.Query.part(null, { id: 'some-id' })).rejects.toThrow('Error fetching part: ' + errorMessage);
      
      spy.mockRestore();
    });
  });

  describe('Mutation.addPart', () => {
    it('should throw error when save fails', async () => {
      const errorMessage = 'Save error';
      // Mocking the constructor and its save method is a bit more complex,
      // but we can mock Part.prototype.save
      const spy = jest.spyOn(Part.prototype, 'save').mockRejectedValue(new Error(errorMessage));
      
      await expect(resolvers.Mutation.addPart(null, { name: 'Test' })).rejects.toThrow('Error adding part: ' + errorMessage);
      
      spy.mockRestore();
    });
  });

  describe('Mutation.updatePart', () => {
    it('should throw error when Part.findByIdAndUpdate() fails', async () => {
      const errorMessage = 'Update error';
      const spy = jest.spyOn(Part, 'findByIdAndUpdate').mockRejectedValue(new Error(errorMessage));
      
      await expect(resolvers.Mutation.updatePart(null, { id: 'some-id' })).rejects.toThrow('Error updating part: ' + errorMessage);
      
      spy.mockRestore();
    });
  });

  describe('Mutation.removePart', () => {
    it('should throw error when Part.findByIdAndDelete() fails', async () => {
      const errorMessage = 'Delete error';
      const spy = jest.spyOn(Part, 'findByIdAndDelete').mockRejectedValue(new Error(errorMessage));
      
      await expect(resolvers.Mutation.removePart(null, { id: 'some-id' })).rejects.toThrow('Error removing part: ' + errorMessage);
      
      spy.mockRestore();
    });
  });
});
