# Database & Data Modeling

This micro-service uses [MongoDB](https://www.mongodb.com/) as its primary data store and [Mongoose](https://mongoosejs.com/) as the Object Data Modeling (ODM) library.

## Why MongoDB?
MongoDB is a NoSQL, document-oriented database that offers:
- **Flexibility**: We can easily change the data structure without complex migrations.
- **Scalability**: Designed for horizontal scaling.
- **Performance**: High-speed read/write operations for many common use cases.

## Mongoose Integration
Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, and business logic hooks.

### Schema Definition
Our main data model is defined in `src/models/Part.js`:

```javascript
const partSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
});
```

### Connection Management
The database connection is managed in `src/db.js`. It includes:
- **Environment Variable Support**: Uses `MONGODB_URI` for configuration.
- **Connection Logic**: Wraps `mongoose.connect()` and provides feedback on connection success or failure.
- **Testability**: Allows passing a dynamic URI to support integration tests (e.g., Testcontainers).

## Data Persistence in Docker
In our `docker-compose.yml`, we define a named volume for MongoDB to ensure that data persists even if the container is removed:

```yaml
volumes:
  mongodb_data:
```

This volume is mounted to `/data/db` inside the MongoDB container.
