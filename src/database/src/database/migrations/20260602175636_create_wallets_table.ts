import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
   await knex.schema.createTable("wallets", (table) => {
      table.increments("id").primary();

      table.integer("user_id").unsigned().notNullable().unique().references("id").inTable("users").onDelete("CASCADE");

      table.bigInteger("balance").notNullable().defaultTo(0);
      table.timestamps(true, true);
   });
}


export async function down(knex: Knex): Promise<void> {
}

