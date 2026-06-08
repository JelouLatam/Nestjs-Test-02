# THEORICAL_ANSWERS.md

This file contains answers to the theoretical questions, quizzes, and any other written parts of the test.

## Problem Resolution

**JavaScript Solution:**
```js
function totalScore(arr) {
  let score = 0;
  for (const n of arr) {
    if (n === 5) {
      score += 5;
    } else if (n % 2 === 0) {
      score += 1;
    } else {
      score += 3;
    }
  }
  return score;
}
// Examples:
console.log(totalScore([1, 2, 3, 4, 5])); // 13
console.log(totalScore([17, 19, 21])); // 9
console.log(totalScore([5, 5, 5])); // 15
```

## Quiz

1. **What verb should you choose for retrieving trade orders with the API server?**
   - **a. GET**

2. **Which API path should you use to retrieve information for a single contact?**
   - **b. /contacts/{contact_id}**

3. **Which HTTP error code(s) should you use for authentication failures?**
   - **d. 401 if the user doesn't exist or if the password is wrong.**

4. **Should you put a fake UUID into the example code?**
   - **a. TRUE**

5. **How much work should your method, handleErrors(response), handle?**
   - **b. Check for the presence of an error. If it exists, throw an exception with the error.**

6. **How should you implement error handling for multiple drivers?**
   - **c. Make a driver-based error provider to handle errors in all classes that can issue errors.**

7. **How should you name your private method for parsing product data?**
   - **c. parseDataForProducts()**

8. **How should you store and access database credentials?**
   - **d. Put them in a .env file, load data from it into a configuration system, then request the credentials from a database service provider.**

## Scenario Analysis

**Optimizing a Distributed System with Latency and Failures:**

1. **Identify the Problem:**
   - Monitor system metrics (latency, error rates) using tools like Prometheus, Grafana, or ELK Stack.
   - Use distributed tracing (e.g., Jaeger, Zipkin) to pinpoint slow or failing microservices.
   - Analyze logs and set up alerts for anomalies.

2. **Possible Solutions:**
   - Implement retries with exponential backoff for transient errors.
   - Use circuit breakers to prevent cascading failures.
   - Add caching for frequently requested data to reduce load.
   - Scale the affected microservice horizontally (add more instances).
   - Optimize code and database queries in the slow service.
   - Use load balancing to distribute requests evenly.
   - Ensure statelessness for easier scaling and recovery.

3. **Ensuring High Availability and Resilience:**
   - Deploy services across multiple availability zones/regions.
   - Use health checks and auto-restart for failed services.
   - Implement failover strategies and redundancy.
   - Regularly test disaster recovery and backup procedures.
   - Continuously monitor and improve based on metrics and incidents.
