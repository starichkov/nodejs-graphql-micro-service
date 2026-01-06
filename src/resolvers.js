import Part from './models/Part.js';

/**
 * GraphQL Resolvers.
 * Resolvers define the logic for fetching the data for each field in the schema.
 * They interact with our data source (Mongoose/MongoDB).
 */
export const resolvers = {
  Query: {
    // Get all parts
    parts: async () => {
      try {
        return await Part.find();
      } catch (error) {
        throw new Error('Error fetching parts: ' + error.message);
      }
    },
    // Get a single part by ID
    part: async (_, { id }) => {
      try {
        const part = await Part.findById(id);
        if (!part) {
          throw new Error('Part not found');
        }
        return part;
      } catch (error) {
        throw new Error('Error fetching part: ' + error.message);
      }
    },
  },
  Mutation: {
    // Add a new part
    addPart: async (_, { name, category, price, stock, description }) => {
      try {
        const newPart = new Part({ name, category, price, stock, description });
        return await newPart.save();
      } catch (error) {
        throw new Error('Error adding part: ' + error.message);
      }
    },
    // Update an existing part
    updatePart: async (_, { id, name, category, price, stock, description }) => {
      try {
        const updatedPart = await Part.findByIdAndUpdate(
          id,
          { name, category, price, stock, description },
          { new: true, runValidators: true }
        );
        if (!updatedPart) {
          throw new Error('Part not found');
        }
        return updatedPart;
      } catch (error) {
        throw new Error('Error updating part: ' + error.message);
      }
    },
    // Remove a part
    removePart: async (_, { id }) => {
      try {
        const deletedPart = await Part.findByIdAndDelete(id);
        if (!deletedPart) {
          throw new Error('Part not found');
        }
        return deletedPart;
      } catch (error) {
        throw new Error('Error removing part: ' + error.message);
      }
    },
  },
};
