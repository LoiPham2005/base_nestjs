// ============================================
// src/shared/database/database.service.ts
// ============================================
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}

  async getConnection(): Promise<Connection> {
    return this.connection;
  }

  async checkConnection(): Promise<boolean> {
    try {
      await this.connection.query('SELECT 1');
      this.logger.log('Database connection is healthy');
      return true;
    } catch (error) {
      this.logger.error('Database connection failed', error);
      return false;
    }
  }

  async runMigrations(): Promise<void> {
    try {
      await this.connection.runMigrations();
      this.logger.log('Migrations executed successfully');
    } catch (error) {
      this.logger.error('Migration failed', error);
      throw error;
    }
  }

  async revertLastMigration(): Promise<void> {
    try {
      await this.connection.undoLastMigration();
      this.logger.log('Last migration reverted successfully');
    } catch (error) {
      this.logger.error('Migration revert failed', error);
      throw error;
    }
  }

  async clearDatabase(): Promise<void> {
    const entities = this.connection.entityMetadatas;

    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }

    this.logger.log('Database cleared successfully');
  }

  async seedDatabase(): Promise<void> {
    // Implement your seeding logic here
    this.logger.log('Database seeded successfully');
  }
}