// In-memory store (resets on every redeploy or cold start)
let expenses = [];

export default function handler(req, res) {
  // Allow only GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method Not Allowed',
      message: `The method ${req.method} is not supported.`,
    });
  }

  // GET → return all expenses
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  }

  // POST → validate and add a new expense
  if (req.method === 'POST') {
    const { amount, description, category, date } = req.body || {};

    // Validation
    const missingFields = [];
    if (amount === undefined) missingFields.push('amount');
    if (!description) missingFields.push('description');
    if (!category) missingFields.push('category');
    if (!date) missingFields.push('date');

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missing: missingFields,
        message: 'You must provide all required fields.',
      });
    }

    const newExpense = {
      id: Date.now().toString(),
      amount: Number(amount),
      description,
      category,
      date,
    };

    expenses.push(newExpense);

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      expense: newExpense,
    });
  }
}
