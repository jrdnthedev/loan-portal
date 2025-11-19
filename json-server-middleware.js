module.exports = (req, res, next) => {
  console.log('middleware is running...', req.method, req.path);
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }

  // Add delay to simulate real API response times
  if (req.path !== '/') {
    setTimeout(next, 200);
  } else {
    next();
  }

  // Add custom routes for authentication
  if (req.path === '/auth/login' && req.method === 'POST') {
    const { email, password } = req.body;

    // Simple mock authentication
    if (email === 'john.doe@example.com' && password === 'password123') {
      res.json({
        user: {
          id: 'user-001',
          email: 'john.doe@example.com',
          role: 'customer',
          profile: {
            firstName: 'John',
            lastName: 'Doe',
            phone: '+1-555-0123',
          },
        },
        token: 'mock-jwt-token-customer',
        expiresIn: 3600,
      });
      return;
    } else if (email === 'loan.officer@bank.com' && password === 'admin123') {
      res.json({
        user: {
          id: 'user-002',
          email: 'loan.officer@bank.com',
          role: 'loan-officer',
          profile: {
            firstName: 'Sarah',
            lastName: 'Williams',
            phone: '+1-555-0456',
          },
        },
        token: 'mock-jwt-token-loan-officer',
        expiresIn: 3600,
      });
      return;
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
  }

  // Custom route for loan submission
  if (req.path === '/loans/submit' && req.method === 'POST') {
    const newLoan = {
      id: `loan-${Date.now()}`,
      ...req.body,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    res.status(201).json(newLoan);
    return;
  }

  next();
};
