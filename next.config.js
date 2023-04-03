module.exports = {
  // ... other configuration options ...
  headers: {
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '1728000',
    // ... other headers ...
  },
  rules: {
    'no-console': 0, // disable the no-console rule
    // ... other rules ...
  },
};

