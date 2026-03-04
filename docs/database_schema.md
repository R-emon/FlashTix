# FlashTix Database Schema Design

This document outlines the domain model and database schema for the FlashTix high-concurrency event ticketing system.

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ TICKET : "purchases/holds"
    USER ||--o{ ORDER : "places"
    VENUE ||--o{ EVENT : "hosts"
    EVENT ||--o{ TICKET : "offers"
    ORDER ||--o{ TICKET : "contains"

    USER {
        bigint id PK
        string email UK
        string password_hash
        string first_name
        string last_name
        string role "USER, ADMIN"
        datetime created_at
    }

    VENUE {
        bigint id PK
        string name
        string address
        int capacity
        datetime created_at
    }

    EVENT {
        bigint id PK
        bigint venue_id FK
        string title
        string description
        datetime start_time
        datetime end_time
        int total_tickets
        int available_tickets
        string status "DRAFT, PUBLISHED, SOLD_OUT, CANCELLED"
        datetime created_at
    }

    TICKET {
        bigint id PK
        bigint event_id FK
        bigint user_id FK "nullable, set when reserved or bought"
        bigint order_id FK "nullable"
        string seat_identifier "e.g. Row A Seat 12"
        decimal price
        string status "AVAILABLE, RESERVED, SOLD"
        datetime reservation_expires_at "for 15 min hold"
        int version "Optimistic Locking"
    }

    ORDER {
        bigint id PK
        bigint user_id FK
        decimal total_amount
        string status "PENDING, COMPLETED, FAILED, REFUNDED"
        string payment_intent_id "Stripe/Payment Gateway ID"
        datetime created_at
        datetime updated_at
    }
```

## Concurrency Handling Strategy

1. **Pessimistic vs. Optimistic Locking:**
   - The `TICKET` table includes a `version` column for **Optimistic Locking (@Version in Spring Data JPA)**.
   - When 10,000 users try to buy 100 tickets, only the first 100 transactions modifying a ticket's version successfully will commit. The rest will throw `OptimisticLockException` which we handle gracefully.

2. **Distributed Locks (Redis):**
   - For booking entire orders, we will utilize Redis distributed locks to prevent users from double-booking identical seats before hitting the DB.

3. **Database Isolation Level:**
   - Write operations (booking tickets) will require `READ COMMITTED` or `REPEATABLE READ` depending on the exact JPA strategy, to prevent dirty reads.
