export async function up(knex) {
  await knex.schema.alterTable('sips', (table) => {
    table.datetime('next_run_at').nullable();
    table.datetime('last_run_at').nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable('sips', (table) => {
    table.dropColumn('next_run_at');
    table.dropColumn('last_run_at');
  });
}
