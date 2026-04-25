export async function up(knex) {
  // Companies table
  await knex.schema.createTable('companies', (table) => {
    table.string('symbol').primary();
    table.string('name').notNullable();
    table.string('sector');
    table.string('category').defaultTo('SHARES');
    table.decimal('current_price', 18, 2);
    table.timestamps(true, true);
  });

  // Portfolios table
  await knex.schema.createTable('portfolios', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('client_name').notNullable();
    table.string('risk_profile').notNullable();
    table.decimal('cash_balance', 18, 2).defaultTo(0);
    table.timestamps(true, true);
  });

  // Holdings table
  await knex.schema.createTable('holdings', (table) => {
    table.increments('id').primary();
    table.uuid('portfolio_id').notNullable().references('id').inTable('portfolios').onDelete('CASCADE');
    table.string('symbol').notNullable().references('symbol').inTable('companies').onDelete('RESTRICT');
    table.decimal('quantity', 18, 4).notNullable().defaultTo(0);
    table.decimal('weighted_avg_cost', 18, 2).notNullable().defaultTo(0);
    table.timestamps(true, true);
    table.unique(['portfolio_id', 'symbol']);
  });

  // Transactions table
  await knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.uuid('portfolio_id').notNullable().references('id').inTable('portfolios').onDelete('CASCADE');
    table.string('symbol').notNullable().references('symbol').inTable('companies').onDelete('RESTRICT');
    table.enum('type', ['BUY', 'SELL']).notNullable();
    table.decimal('quantity', 18, 4).notNullable();
    table.decimal('price', 18, 2).notNullable();
    table.decimal('amount', 18, 2).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('holdings');
  await knex.schema.dropTableIfExists('portfolios');
  await knex.schema.dropTableIfExists('companies');
}
