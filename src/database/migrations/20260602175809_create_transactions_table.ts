import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
   await knex.schema.createTable("transactions", (table) => {
      table.increments("id").primary();
      table.integer("wallet_id").unsigned().notNullable();
      table.integer("related_wallet_id").unsigned().nullable();

      table.string("type").notNullable();
      table.bigInteger("amount").notNullable();
      table.string("reference").notNullable().unique();
      table.string("status").notNullable().defaultTo("successful");
      table.text("narration").nullable();

      table.foreign("wallet_id").references("id").inTable("wallets").onDelete("CASCADE");
      table.foreign("related_wallet_id").references("id").inTable("wallets").onDelete("SET NULL");

      table.timestamps(true, true);
   });
}


export async function down(knex: Knex): Promise<void> {
   await knex.schema.dropTableIfExists("transactions");
}

