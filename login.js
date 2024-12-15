const http = require('http');
const url = require('url');
const { parse } = require('querystring');

// In-memory "database" for user registrations (you can extend this for persistence).
let users = [];

const regexValidation = {
    USER_NAME: /^[a-zA-Z0-9]+$/,
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PASSWORD:  /^[a-zA-Z0-9]{8,}$/
}
const server = http.createServer((req, res) => {
  // Get the request URL and HTTP method
  const parsedUrl = url.parse(req.url, true);
  const { method } = req;

  // Handling the register endpoint
  if (parsedUrl.pathname === '/register' && method === 'POST') {
    let body = '';
    // Collect the data sent in the request body
    req.on('data', chunk => {
      body += chunk;
    });

    // Once the entire body is received, process it
    req.on('end', () => {
      try {
        // Parse the JSON body
        const parsedBody = JSON.parse(body);

        // Simple validation for missing fields
        const { username, password, email } = parsedBody;
        if (!username || !password || !email) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ message: 'All fields are required (username, password, email)' }));
        }

        // Check if user already exists (simple in-memory check)
        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ message: 'Username already exists' }));
        }
        if(!regexValidation.USER_NAME.test(username)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'Username should be Alphanumberic' }));
        }

        if(!regexValidation.EMAIL.test(email)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'Email should be correct format' }));
        }

        if(!regexValidation.PASSWORD.test(password)) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ message: 'password should match regex' }));
        }
        // Add the new user to the in-memory "database"
        users.push({ username, password, email });

        // Respond with a success message
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'User registered successfully!' }));

      } catch (err) {
        // Handle errors (e.g., if the body isn't valid JSON)
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Invalid JSON body' }));
      }
    });

  } else {
    // If the path isn't /register or the method isn't POST
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Not Found' }));
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});