# Product Requirements Document: TODO CRUD Application

## Executive Summary

This document outlines the requirements for a simple TODO CRUD (Create, Read, Update, Delete) application built with NestJS. The application provides a RESTful API for managing todo items, allowing users to create, retrieve, update, and delete tasks.

## Product Overview

### Purpose
The TODO CRUD application is a backend service that provides a simple and efficient way to manage todo items through a RESTful API. It serves as a foundational module that can be extended with additional features such as user authentication, categories, priorities, and more.

### Current State
The application has a basic NestJS module structure in place:
- `src/todo/todo.module.ts` - Module definition
- `src/todo/todo.controller.ts` - Controller with scaffolded CRUD endpoints
- `src/todo/todo.service.ts` - Service with placeholder implementations
- `src/todo/entities/todo.entity.ts` - Empty entity class
- `src/todo/dto/create-todo.dto.ts` - Empty DTO class
- `src/todo/dto/update-todo.dto.ts` - Partial DTO extending CreateTodoDto

All endpoints are currently scaffolded but not implemented.

## User Stories

1. **As a user**, I want to create a new todo item with a title and optional description, so that I can track tasks I need to complete.

2. **As a user**, I want to retrieve all my todo items, so that I can see what tasks I have.

3. **As a user**, I want to retrieve a specific todo item by ID, so that I can view its details.

4. **As a user**, I want to update a todo item (title, description, or completion status), so that I can modify tasks as needed.

5. **As a user**, I want to delete a todo item, so that I can remove tasks that are no longer needed.

6. **As a user**, I want to receive clear error messages when operations fail, so that I can understand what went wrong.

## Functional Requirements

### FR1: Create Todo Item
- **Endpoint**: `POST /todo`
- **Request Body**: 
  - `title` (string, required): The title of the todo item (max 200 characters)
  - `description` (string, optional): Additional details about the todo item (max 1000 characters)
- **Response**: 
  - Status: `201 Created`
  - Body: Created todo object with generated ID and timestamps
- **Validation**:
  - Title must be provided and non-empty
  - Title must not exceed 200 characters
  - Description must not exceed 1000 characters if provided
- **Error Handling**:
  - `400 Bad Request`: Invalid input data
  - `500 Internal Server Error`: Server-side errors

### FR2: Retrieve All Todo Items
- **Endpoint**: `GET /todo`
- **Request**: No parameters required
- **Response**:
  - Status: `200 OK`
  - Body: Array of all todo items
- **Error Handling**:
  - `500 Internal Server Error`: Server-side errors

### FR3: Retrieve Single Todo Item
- **Endpoint**: `GET /todo/:id`
- **Request Parameters**:
  - `id` (number, required): The unique identifier of the todo item
- **Response**:
  - Status: `200 OK`
  - Body: Todo object matching the provided ID
- **Error Handling**:
  - `400 Bad Request`: Invalid ID format
  - `404 Not Found`: Todo item with the specified ID does not exist
  - `500 Internal Server Error`: Server-side errors

### FR4: Update Todo Item
- **Endpoint**: `PATCH /todo/:id`
- **Request Parameters**:
  - `id` (number, required): The unique identifier of the todo item
- **Request Body**: Partial update object
  - `title` (string, optional): Updated title (max 200 characters)
  - `description` (string, optional): Updated description (max 1000 characters)
  - `completed` (boolean, optional): Completion status
- **Response**:
  - Status: `200 OK`
  - Body: Updated todo object
- **Validation**:
  - At least one field must be provided for update
  - Title must not exceed 200 characters if provided
  - Description must not exceed 1000 characters if provided
- **Error Handling**:
  - `400 Bad Request`: Invalid input data or ID format
  - `404 Not Found`: Todo item with the specified ID does not exist
  - `500 Internal Server Error`: Server-side errors

### FR5: Delete Todo Item
- **Endpoint**: `DELETE /todo/:id`
- **Request Parameters**:
  - `id` (number, required): The unique identifier of the todo item
- **Response**:
  - Status: `200 OK` or `204 No Content`
  - Body: Success message or empty body
- **Error Handling**:
  - `400 Bad Request`: Invalid ID format
  - `404 Not Found`: Todo item with the specified ID does not exist
  - `500 Internal Server Error`: Server-side errors

## API Endpoint Specifications

### Base URL
All endpoints are prefixed with `/todo`

### Endpoints Summary

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|--------------|
| POST | `/todo` | Create a new todo item | 201, 400, 500 |
| GET | `/todo` | Retrieve all todo items | 200, 500 |
| GET | `/todo/:id` | Retrieve a specific todo item | 200, 400, 404, 500 |
| PATCH | `/todo/:id` | Update a todo item | 200, 400, 404, 500 |
| DELETE | `/todo/:id` | Delete a todo item | 200/204, 400, 404, 500 |

### Request/Response Examples

#### Create Todo
**Request:**
```http
POST /todo
Content-Type: application/json

{
  "title": "Complete project documentation",
  "description": "Write comprehensive PRD and API documentation"
}
```

**Response:**
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive PRD and API documentation",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Get All Todos
**Request:**
```http
GET /todo
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": 1,
    "title": "Complete project documentation",
    "description": "Write comprehensive PRD and API documentation",
    "completed": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get Single Todo
**Request:**
```http
GET /todo/1
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive PRD and API documentation",
  "completed": false,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Update Todo
**Request:**
```http
PATCH /todo/1
Content-Type: application/json

{
  "completed": true
}
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 1,
  "title": "Complete project documentation",
  "description": "Write comprehensive PRD and API documentation",
  "completed": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

#### Delete Todo
**Request:**
```http
DELETE /todo/1
```

**Response:**
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Todo item deleted successfully"
}
```

### Error Response Format
All error responses should follow this structure:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

## Data Model Definition

### Todo Entity

The Todo entity represents a single todo item with the following properties:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | number | Yes | Auto-generated, Unique | Primary key identifier |
| `title` | string | Yes | Max 200 characters, Non-empty | The title of the todo item |
| `description` | string | No | Max 1000 characters | Additional details about the todo |
| `completed` | boolean | Yes | Default: false | Completion status of the todo |
| `createdAt` | Date/ISO string | Yes | Auto-generated | Timestamp when todo was created |
| `updatedAt` | Date/ISO string | Yes | Auto-updated | Timestamp when todo was last updated |

### TypeScript Entity Structure
```typescript
export class Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### DTOs

#### CreateTodoDto
```typescript
export class CreateTodoDto {
  title: string;        // Required, max 200 chars
  description?: string; // Optional, max 1000 chars
}
```

#### UpdateTodoDto
```typescript
export class UpdateTodoDto {
  title?: string;      // Optional, max 200 chars
  description?: string; // Optional, max 1000 chars
  completed?: boolean; // Optional
}
```

## Technical Requirements

### Framework & Language
- **Framework**: NestJS v11.x
- **Language**: TypeScript
- **Runtime**: Node.js

### Architecture
- **Pattern**: MVC (Model-View-Controller) with NestJS module structure
- **Module**: `TodoModule` in `src/todo/`
- **Controller**: `TodoController` handling HTTP requests
- **Service**: `TodoService` containing business logic
- **Entity**: `Todo` entity class for data structure
- **DTOs**: `CreateTodoDto` and `UpdateTodoDto` for request validation

### Data Persistence
- **MVP Approach**: In-memory storage using an array or Map
- **Future Ready**: Structure should be database-ready (can easily integrate TypeORM, Prisma, or Mongoose)
- **Data Lifecycle**: Data persists only during application runtime (resets on server restart)

### Validation
- Use NestJS `class-validator` decorators for DTO validation
- Implement validation pipes at the application or controller level
- Return appropriate HTTP status codes and error messages

### Error Handling
- Implement global exception filters or use NestJS built-in exception handling
- Return consistent error response format
- Log errors appropriately for debugging

### Testing Requirements
- Unit tests for `TodoService` methods
- Unit tests for `TodoController` endpoints
- E2E tests for all API endpoints
- Test coverage target: Minimum 80% for service and controller

### Code Quality
- Follow NestJS best practices and conventions
- Use TypeScript strict mode
- Follow existing ESLint and Prettier configurations
- Write self-documenting code with appropriate comments

### API Documentation
- Consider implementing Swagger/OpenAPI documentation using `@nestjs/swagger`
- Document all endpoints, request/response schemas, and error codes

## Success Criteria

1. **Functional Completeness**
   - All CRUD operations are fully implemented and working
   - All endpoints return correct HTTP status codes
   - Validation works correctly for all inputs
   - Error handling provides meaningful messages

2. **Code Quality**
   - Code follows NestJS best practices
   - All TypeScript types are properly defined
   - No linter errors
   - Code is properly structured and maintainable

3. **Testing**
   - All service methods have unit tests
   - All controller endpoints have unit tests
   - E2E tests cover all CRUD operations
   - Test coverage meets minimum requirements

4. **API Compliance**
   - All endpoints match the specifications in this PRD
   - Request/response formats match documented examples
   - Error responses follow the standard format

5. **Documentation**
   - Code is self-documenting
   - API documentation is available (Swagger or similar)
   - README includes setup and usage instructions

## Future Enhancements (Optional)

The following features are not part of the initial scope but could be considered for future iterations:

1. **Database Integration**
   - Integrate with PostgreSQL, MySQL, or MongoDB
   - Implement proper data persistence across server restarts

2. **User Authentication**
   - Add user accounts and authentication
   - Associate todos with specific users
   - Implement authorization for todo access

3. **Additional Features**
   - Todo categories/tags
   - Priority levels (low, medium, high)
   - Due dates and reminders
   - Todo search and filtering
   - Pagination for todo lists
   - Sorting options (by date, completion status, etc.)

4. **Advanced Functionality**
   - Todo sharing between users
   - Subtasks/nested todos
   - Todo attachments
   - Activity history/audit log

5. **Performance & Scalability**
   - Caching layer (Redis)
   - Rate limiting
   - Database indexing
   - Query optimization

## Appendix

### Related Files
- Module: `src/todo/todo.module.ts`
- Controller: `src/todo/todo.controller.ts`
- Service: `src/todo/todo.service.ts`
- Entity: `src/todo/entities/todo.entity.ts`
- DTOs: `src/todo/dto/create-todo.dto.ts`, `src/todo/dto/update-todo.dto.ts`

### Dependencies
- `@nestjs/common`: Core NestJS functionality
- `@nestjs/core`: NestJS core framework
- `@nestjs/platform-express`: Express platform adapter
- `@nestjs/mapped-types`: Utility for creating DTOs
- `class-validator`: Validation decorators (recommended)
- `class-transformer`: Object transformation (recommended)

---

**Document Version**: 1.0  
**Last Updated**: 2024-01-15  
**Status**: Draft
