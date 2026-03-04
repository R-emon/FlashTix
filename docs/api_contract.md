# FlashTix API Contract Design

This document outlines the RESTful API endpoints for the FlashTix ticketing system.
Base URL: `/api/v1`

## 1. Authentication (`/auth`)
- **POST `/auth/register`**: Register a new user.
  - Request: `{ first_name, last_name, email, password }`
  - Response: `201 Created` - `{ id, email, token }`
- **POST `/auth/login`**: Authenticate a user.
  - Request: `{ email, password }`
  - Response: `200 OK` - `{ id, email, token, roles }`

## 2. Users (`/users`)
- **GET `/users/me`**: Get current user profile.
  - Response: `200 OK` - `{ id, first_name, last_name, email }`

## 3. Venues (`/venues`)
- **GET `/venues`**: List venues (Admin & Public).
  - Response: `200 OK` - `[{ id, name, location, capacity }]`
- **POST `/venues`**: Create a venue (Admin only).
  - Request: `{ name, location, capacity }`
  - Response: `201 Created` - Venue Resource
- **GET `/venues/{id}`**: Get venue details.
  - Response: `200 OK` - Venue Resource

## 4. Events (`/events`)
- **GET `/events`**: Search/list public events (with pagination/filters).
  - Query Params: `?date=YYYY-MM-DD&venue_id=123&page=0&size=20`
  - Response: `200 OK` - Page object of Event Summaries.
- **POST `/events`**: Create a new event (Admin only).
  - Request: `{ venue_id, title, description, start_time, end_time, total_tickets }`
  - Response: `201 Created` - Event Resource
- **GET `/events/{id}`**: Get event details.
  - Response: `200 OK` - Detailed Event Resource
- **GET `/events/{id}/tickets`**: Get available tickets/seats for an event.
  - Response: `200 OK` - `[{ id, seat_identifier, price, status }]`

## 5. Orders & Reservations (`/orders`)
- **POST `/orders/reserve`**: Reserve specific seats (initiates a 15-minute lock).
  - Request: `{ event_id, ticket_ids: [1, 2, 3] }`
  - Response: `201 Created` - Order Resource with status `PENDING`
- **POST `/orders/{id}/checkout`**: Complete the purchase.
  - Request: `{ payment_method_id }`
  - Response: `200 OK` - Order Resource with status `COMPLETED`
- **GET `/orders`**: Get logged-in user's orders.
  - Response: `200 OK` - List of Orders

## API Response Format
All responses should conform to a standard envelope (or utilize standardized HTTP status codes effectively):
```json
{
  "timestamp": "2026-03-04T12:00:00Z",
  "status": 200,
  "data": { ... },
  "error": null,
  "message": "Success"
}
```
