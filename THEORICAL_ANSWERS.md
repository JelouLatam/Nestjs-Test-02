# Problem Resolution

## Scoring Rules
Given an array of integers, calculate the total score based on the following rules:

1. Add 1 point for every even number in the array.
2. Add 3 points for every odd number in the array, except for the number "5".
3. Add 5 points every time the number "5" appears in the array.

**Note:** 0 is considered an even number.

### Examples
```javascript

function calculateScore(arr) {
    return arr.reduce((score, num) => 
        score + (num === 5 ? 5 : num % 2 === 0 ? 1 : 3), 0);
}

Input: calculateScore([1, 2, 3, 4, 5])
Output: 13

Input: calculateScore([17, 19, 21])
Output: 9

Input: calculateScore([5, 5, 5])
Output: 15
```



**Environment:** JavaScript (Node.js 20)

---

# Quiz

### 1. Fastest API Verb for Read-Only Operations
**Answer:** `a. GET`

### 2. Best API Path for Retrieving a Single Contact
**Answer:** `b. /contacts/{contact_id}`

### 3. Secure Error Codes for Authentication Failures
**Answer:** `a. 404 if the user doesn't exist, and 403 if the password is wrong.`

### 4. Using Fake UUIDs in Documentation
**Answer:** `a. TRUE`

### 5. Error Handling in handleErrors(response)
**Answer:** `b. Check for the presence of an error. If it exists, throw an exception with the error.`

### 6. Error Handling Across Database and Email Drivers
**Answer:** `b. Make a trait to handle errors so it'll collect errors in any class that uses it.`

### 7. Naming a Private Method for Parsing eCommerce Product Data
**Answer:** `c. parseDataForProducts()`

### 8. Securely Storing Database Credentials
**Answer:** `d. Put them in a .env file, load data from it into a configuration system, request the credentials from a database service provider.`

---

# Scenario Analysis: Optimizing a Distributed System

## **Identifying the Problem:**
1. Monitor latency and failure rates using logging and tracing tools (e.g., Prometheus, Grafana, ELK Stack).
2. Identify if the issue is due to network latency, service overload, or database bottlenecks.
3. Examine logs for error patterns and performance issues.

## **Possible Solutions:**
1. **Load Balancing** - Distribute traffic evenly across microservices.
2. **Circuit Breaker Pattern** - Prevent cascading failures by temporarily blocking unresponsive services.
3. **Retry Mechanism with Exponential Backoff** - Automatically retry failed requests after increasing time intervals.
4. **Caching Strategies** - Reduce database calls by caching frequent requests using Redis or Memcached.
5. **Message Queues** - Use asynchronous processing with tools like RabbitMQ or Kafka to handle spikes in traffic.
6. **Auto-Scaling** - Dynamically allocate resources based on demand using Kubernetes or cloud-based scaling solutions.

## **Ensuring High Availability & Resilience:**
1. Implement redundancy with multi-region deployments.
2. Use a Service Mesh (e.g., Istio) to handle service-to-service communication efficiently.
3. Perform Chaos Engineering tests to simulate failures and optimize recovery strategies.
4. Maintain proper health checks and failover mechanisms to switch to backup instances if a primary service fails.

By implementing these strategies, the system will be more resilient to failures while maintaining optimal performance and high availability.
