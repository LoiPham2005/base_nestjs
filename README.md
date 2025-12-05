# NestJS Base Template

Enterprise-grade NestJS base template with best practices, production-ready features, and scalable architecture.

## 🚀 Features

### Core Features
- ✅ **NestJS 10.x** - Latest version with full TypeScript support
- ✅ **TypeORM** - Database ORM with PostgreSQL
- ✅ **Authentication & Authorization** - JWT-based auth with role-based access control
- ✅ **Redis Caching** - High-performance caching layer
- ✅ **Swagger Documentation** - Auto-generated API documentation
- ✅ **Validation** - Request validation with class-validator
- ✅ **Error Handling** - Centralized exception handling
- ✅ **Logging** - Structured logging with correlation IDs
- ✅ **Rate Limiting** - API rate limiting with Redis
- ✅ **Security** - Helmet, CORS, XSS protection

### Advanced Features
- ✅ **Base Repository Pattern** - Generic repository for CRUD operations
- ✅ **Pagination** - Built-in pagination support
- ✅ **Soft Delete** - Soft delete functionality for entities
- ✅ **File Upload** - File upload with validation
- ✅ **Email Service** - Email sending capability
- ✅ **Queue System** - Background job processing
- ✅ **Database Migrations** - TypeORM migrations
- ✅ **Docker Support** - Docker and docker-compose configuration
- ✅ **Testing** - Unit and E2E testing setup

## 📁 Project Structure

```
src/
├── common/              # Shared resources
│   ├── configs/        # Configuration files
│   ├── constants/      # Application constants
│   ├── decorators/     # Custom decorators
│   ├── dto/           # Common DTOs
│   ├── entities/      # Base entities
│   ├── enums/         # Enums
│   ├── exceptions/    # Custom exceptions
│   ├── guards/        # Global guards
│   ├── interceptors/  # Interceptors
│   ├── interfaces/    # Common interfaces
│   ├── middlewares/   # Middlewares
│   ├── pipes/         # Custom pipes
│   └── utils/         # Utility functions
│
├── modules/            # Feature modules
│   ├── auth/          # Authentication module
│   └── users/         # Users module
│
├── shared/            # Infrastructure modules
│   ├── database/     # Database configuration
│   ├── redis/        # Redis service
│   ├── logger/       # Logger service
│   ├── mail/         # Email service
│   ├── storage/      # File storage
│   └── queue/        # Queue service
│
├── app.module.ts      # Root module
├── app.controller.ts  # Root controller
└── main.ts           # Application entry point
```

## 🛠️ Installation

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 14.x or higher
- Redis 7.x or higher
- Docker & Docker Compose (optional)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd nestjs-base-template
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database setup**
```bash
# Start PostgreSQL and Redis with Docker
docker-compose up -d postgres redis

# Run migrations
npm run migration:run

# Seed database (optional)
npm run seed
```

5. **Start the application**
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## 🐳 Docker Deployment

### Development with Docker
```bash
docker-compose up
```

### Production Build
```bash
docker build -t nestjs-app .
docker run -p 3000:3000 nestjs-app
```

## 📚 API Documentation

Once the application is running, access Swagger documentation at:
```
http://localhost:3000/api/docs
```

## 🔐 Authentication

### Register
```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "Password123!",
  "passwordConfirmation": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Protected Routes
Add the JWT token to request headers:
```
Authorization: Bearer <your-jwt-token>
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Database Migrations

```bash
# Generate migration
npm run migration:generate -- -n MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment | development |
| PORT | Application port | 3000 |
| DATABASE_HOST | PostgreSQL host | localhost |
| DATABASE_PORT | PostgreSQL port | 5432 |
| DATABASE_NAME | Database name | nestjs_template |
| REDIS_HOST | Redis host | localhost |
| REDIS_PORT | Redis port | 6379 |
| JWT_SECRET | JWT secret key | - |
| JWT_EXPIRATION | JWT expiration | 1d |

## 🏗️ Architecture Patterns

### 1. Repository Pattern
```typescript
export class UserRepository extends BaseRepository<User> {
  // Custom methods
}
```

### 2. Service Layer
```typescript
@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}
}
```

### 3. Controller Layer
```typescript
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
}
```

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Input Validation** - Request validation
- **XSS Protection** - Cross-site scripting prevention
- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt password hashing

## 📈 Performance Optimization

- **Redis Caching** - Data caching
- **Database Indexing** - Optimized queries
- **Compression** - Response compression
- **Connection Pooling** - Database connection pooling

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Support

For support, email support@example.com or open an issue in the repository.

## 🎯 Roadmap

- [ ] GraphQL support
- [ ] Microservices architecture
- [ ] WebSocket support
- [ ] CQRS pattern
- [ ] Event sourcing
- [ ] Multi-tenancy
- [ ] API versioning
- [ ] Monitoring & alerting

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [Redis Documentation](https://redis.io/documentation)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

Made with ❤️ using NestJS