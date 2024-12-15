const express = require('express');
const app = express();
const port = 3000;

const responseTimes = []; // Store response times for report generation

// Middleware to log response times
app.use((req, res, next) => {
  const start = Date.now(); // Record start time

  res.on('finish', () => {
    const duration = Date.now() - start; // Calculate response time
    responseTimes.push({ route: req.originalUrl, duration });

    // Alert if the response time exceeds the threshold (200ms)
    if (duration > 200) {
      console.warn(`ALERT: ${req.originalUrl} took ${duration}ms which exceeds the threshold!`);
    }
  });

  next();
});



// Endpoint to generate a performance report
app.get('/api/report', (req, res) => {
  const aggregatedData = responseTimes.reduce((acc, { route, duration }) => {
    if (!acc[route]) {
      acc[route] = { totalDuration: 0, count: 0 };
    }
    acc[route].totalDuration += duration;
    acc[route].count += 1;
    return acc;
  }, {});

  const report = Object.keys(aggregatedData).map(route => {
    const { totalDuration, count } = aggregatedData[route];
    const avgDuration = totalDuration / count;
    return { route, avgDuration };
  });

  res.json(report); // Return the aggregated report
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});