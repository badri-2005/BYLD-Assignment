export async function up(knex) {
  await knex('companies').insert([
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      sector: 'Technology',
      current_price: 150.25,
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      sector: 'Technology',
      current_price: 140.50,
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      sector: 'Technology',
      current_price: 380.75,
    },
    {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      sector: 'Consumer',
      current_price: 175.30,
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      sector: 'Automotive',
      current_price: 250.00,
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase',
      sector: 'Finance',
      current_price: 190.45,
    },
    {
      symbol: 'WMT',
      name: 'Walmart Inc.',
      sector: 'Retail',
      current_price: 85.60,
    },
    {
      symbol: 'DIS',
      name: 'The Walt Disney Company',
      sector: 'Entertainment',
      current_price: 92.30,
    },
  ]);
}

export async function down(knex) {
  await knex('companies').whereIn('symbol', ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'JPM', 'WMT', 'DIS']).del();
}
