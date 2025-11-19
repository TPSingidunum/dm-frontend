# Database Migrations

This directory contains SQL migration files for the database schema.

## User Event Tracking

### Migration: 001_create_user_event_table.sql

Creates the `user_event` table for tracking user interactions with products.

**Table Structure:**
- `event_id`: Primary key, auto-incrementing
- `user_id`: Foreign key to user table
- `product_id`: Foreign key to product table  
- `event_type`: Type of event ('view', 'add_to_cart', 'purchase')
- `created_at`: Timestamp of when the event occurred

**Indexes:**
- Index on `user_id` for fast user event lookups
- Index on `product_id` for fast product event lookups
- Index on `event_type` for filtering by event type
- Index on `created_at` for time-based queries

## Running Migrations

To apply the migration, run the SQL file against your database:

```bash
mysql -u [username] -p [database_name] < migrations/001_create_user_event_table.sql
```

Or use your preferred database management tool to execute the SQL statements.
