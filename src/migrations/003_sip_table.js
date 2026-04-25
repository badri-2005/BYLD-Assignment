export async function up(knex) {
  await knex.schema.createTable('sips', (table) => {
    table.increments('id').primary();
    table.uuid('portfolio_id').notNullable().references('id').inTable('portfolios').onDelete('CASCADE');
    table.string('symbol').notNullable().references('symbol').inTable('companies').onDelete('RESTRICT');
    table.decimal('amount', 18, 2).notNullable();
    table.enum('frequency', ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY', 'YEARLY']).notNullable();
    table.date('start_date').notNullable();
    table.date('end_date');
    table.boolean('is_active').defaultTo(true);
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('sips');
}
