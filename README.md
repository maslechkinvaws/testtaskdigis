# TestTaskDigis

Simple NestJS project with Docker and PostgreSQL.

## Overview

Project includes:
- NestJS API
- PostgreSQL database
- Docker Compose for local development
- Seeder to populate test data
- Swagger documentation

## Requirements

- Docker 27+
- Docker Compose 2+
- Node.js 22+
- npm 10+

## Docker Commands

Start all services in detached mode:
```bash
docker compose up -d
```

Check container status:
```bash
docker compose ps
```

Stop Docker:
```bash
docker compose down
```

Stop and remove containers with volumes:
```bash
docker compose down -v
```

Restart Docker:
```bash
docker compose restart
```

## Logs

View logs for a specific service:
```bash
docker compose logs api       # NestJS logs
docker compose logs postgres  # PostgreSQL logs
```

## Seeder

To run seeder inside the container:
```bash
docker compose exec api npm run seed:records -- <number> [--append]
```

Example: add 100 records:
```bash
docker compose exec api npm run seed:records -- 100 --append
```

> **Note:** Seeder must be run inside the container to access the database by hostname `postgres`.

## Swagger

Swagger documentation is available after starting the API:
[http://localhost:3000/docs](http://localhost:3000/docs)

## Environment Variables

Set in `.env` or `docker-compose.yml`:
```env
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=digisuser
DB_PASSWORD=digispassword
DB_NAME=digisdb
DB_AUTO_RUN_MIGRATIONS=true
PORT=3000
NODE_ENV=development
```

## npm Scripts

```bash
npm run start         # Start production
npm run start:dev     # Start with hot-reload
npm run build         # Build project
npm run lint          # Lint code
npm run test          # Run tests
npm run migrations:run # Run migrations
npm run seed:records  # Run seed data
```

## Contacts

For support and questions, contact the project maintainer.