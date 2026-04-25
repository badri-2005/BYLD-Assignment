export async function up(knex) {
  try {
    await knex.raw(`
      ALTER TABLE "holdings" 
      RENAME COLUMN "weighted_avg_cost" TO "avg_cost"
    `);
  } catch (error) {
    console.log('Column might already be renamed:', error.message);
  }
}

export async function down(knex) {
  try {
    await knex.raw(`
      ALTER TABLE "holdings" 
      RENAME COLUMN "avg_cost" TO "weighted_avg_cost"
    `);
  } catch (error) {
    console.log('Error renaming column back:', error.message);
  }
}
