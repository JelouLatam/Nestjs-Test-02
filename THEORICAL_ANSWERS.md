# Test for Intermediate Backend Developer

## Problem Resolution

Given an array of integers, maintain a total score based on the following rules:

1. Add 1 point for every even number in the array
2. Add 3 points for every odd number in the array, except for the number "5"
3. Add 5 points every time the number "5" appears in the array

Note: 0 is considered even.

```bash

Examples:
Input: [1, 2, 3, 4, 5] Output: 13
Input: [17, 19, 21] Output: 9
Input: [5, 5, 5] Output: 15

```

### Code

```javascript

function calculateScore(arr) {
    let score = 0;
    arr.forEach(num => {
        if (num === 5) { score += 5; } 
        else if (num % 2 === 0) { score += 1; } 
        else { score += 3; }
    });
    return score;
}

console.log(calculateScore([1, 2, 3, 4, 5])); // Output: 13
console.log(calculateScore([17, 19, 21])); // Output: 9
console.log(calculateScore([5, 5, 5])); // Output: 15

```

Run code: https://playcode.io/2024128

## Quiz

**1:** You're building a high-throughput API for a cryptocurrency trading platform. For this platform, time is extremely important because microseconds count when processing high-volume trade orders. For communicating with the API, you want to choose the verb that is fastest for read-only operations.

**Q: What verb should you choose for retrieving trade orders with the API server?**

**A:** GET
## 

**2:** You work for a Customer Relationship Management CRM company. The company's clients gain CRM access through a RESTful API. The CRM allows clients to add contact information for customers, prospects, and related persons (e.g., virtual assistants or marketing directors). You want to choose an appropriate API request path so clients can easily retrieve information for a single contact while also being flexible for future software changes.

**Q: Which of the following API paths should you use?**

**A:** /contacts/{contact_id}
## 

**3:** You work for a large social media network, and you've been tasked with error handling for the API. You're trying to decide on an appropriate error code for authentication failures based on non-existent users and incorrect passwords. You want to balance security against brute force attacks with providing descriptive and true error codes.

**Q: Which HTTP error code(s) should you use to keep the system secure and still report that an error occurred?**

**A:** 404 if the user doesn't exist, and 403 if the password is wrong.
## 

**4:** You're writing documentation for requesting information about a given user in your system. Your system uses UUIDS (universally unique identifiers) as user identifiers. In your documentation, you want to show an example. 

**Q: True or false: You should put a fake UUID into the example code (instead of just the text "UUID") as a placeholder.**

**A:** TRUE
## 

**5:** You're building code to handle errors issued from a remote API server. The response may or may not have an error.

**Q: How much work should your method, handleErrors(response), handle?**

**A:** Check for the presence of an error. If it exists, set a class property to the error, then throw an exception.
## 

**6:** You have two classes: a database driver and an email driver. Both classes need to set errors so that your front-end interface displays any errors that transpire on your platform.

**Q: Which way should you implement this error handling?**

**A:** Make a trait to handle errors so it'll collect errors in any class that uses it.
## 

**7:** You need to name the private method in your class that handles looping through eCommerce products to collect and parse data. That data gets stored in an array and set as a class property.

**Q: Which of the following should you use to name your method?**

**A:**  parseDataForProducts()
## 

**8:** There are multiple places in your codebase that need to access the database. To access the database, you need to supply credentials. You want to balance security with useability.

**Q: What strategy should you use to store and access these credentials**

**A:** Put them in a .env file, load data from it into a configuration system, then request the credentials from a database service provider.
## 

## Scenario Analysis

Given a distributed system that experiences latencies and occasional failures in one of its microservices, how would you optimize it?
Describe your approach to identifying the problem, possible solutions, and how you would ensure high availability and resilience.

### 1. Identification of the Problem:

- **Logging and Monitoring:** Start by reviewing logs and monitoring metrics to identify which microservices might be causing latency or failures.

- **Request Tracing:** Implement distributed tracing to see the flow of requests and locate points of failure or bottlenecks; tools for this might include the use of Zipkin or Apache Kafka.

- **Check Network Latency:** Use network monitoring tools to verify whether the issue comes from delays in network communication between microservices.

### 2. Possible Solutions:

- **Load Balancing:** If a microservice is handling too many requests, introduce a load balancer to distribute the traffic.

- **Caching:** Implement caching to reduce repeated calls to slower microservices or databases; an effective tool for this would be the use of Redis.

- **Circuit Breaker Pattern:** Use the circuit breaker pattern to prevent cascading failures. If a microservice is slow or down, the circuit breaker can temporarily stop requests to it.

- **Retry Mechanism:** Implement a retry mechanism with exponential backoff for transient failures.

- **Horizontal Scaling:** Scale problematic services horizontally to handle higher loads.

### 3. To ensure high availability and resilience, I would recommend the following:

- **Redundancy:** Ensure redundancy for critical services to provide failover options.

- **Auto-scaling:** Set up auto-scaling rules to dynamically adjust the number of instances of microservices based on demand.

- **Graceful Degradation:** Ensure that the system continues to operate in a degraded state even if some microservices fail, offering limited functionality.
