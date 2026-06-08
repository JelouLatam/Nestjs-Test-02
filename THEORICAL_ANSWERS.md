# Technical Quiz Answers

This document contains the answers and explanations for the technical quiz questions related to API design, error handling, and software development best practices.

## Questions & Answers

### 1. High-throughput API Verb Selection
**Correct Answer: a. GET**

Explanation: GET is the fastest HTTP verb for read-only operations because:
- It's cacheable
- It doesn't require a request body
- Most web servers optimize GET requests
- It's idempotent, making it safe for repeated calls

### 2. CRM API Path Design
**Correct Answer: b. /contacts/{contact_id}**

Explanation: This is the most appropriate choice because:
- It's RESTful and resource-focused
- It's generic enough to handle all contact types
- It follows REST best practices for singular resource access
- It's flexible for future changes

### 3. Authentication Error Handling
**Correct Answer: d. 401 if the user doesn't exist or if the password is wrong**

Explanation: This is the most secure approach because:
- It doesn't leak information about user existence
- 401 is the standard code for authentication failures
- It prevents user enumeration attacks
- It follows security best practices

### 4. UUID Documentation
**Correct Answer: a. TRUE**

Explanation: Using a real UUID example is better because:
- It shows the actual format developers will work with
- It makes documentation more practical and clear
- It helps prevent format-related mistakes
- It serves as a valid test case

### 5. Error Handling Implementation
**Correct Answer: b. Check for the presence of an error. If it exists, throw an exception with the error.**

Explanation: This is the best practice because:
- It follows single responsibility principle
- It allows for proper error propagation
- It enables centralized error handling
- It's cleaner and more maintainable

### 6. Error Handling Architecture
**Correct Answer: b. Make a trait to handle errors so it'll collect errors in any class that uses it.**

Explanation: Using a trait is optimal because:
- It promotes code reusability
- It maintains consistency across classes
- It reduces code duplication
- It's easier to maintain and modify

### 7. Method Naming
**Correct Answer: c. parseDataForProducts()**

Explanation: This name is best because:
- It's concise yet descriptive
- It focuses on the method's purpose, not implementation
- It follows clean code principles
- It's easier to maintain and understand

### 8. Database Credentials Management
**Correct Answer: d. Put them in a .env file, load data from it into a configuration system, then request the credentials from a database service provider.**

Explanation: This is the most secure and maintainable approach because:
- It separates configuration from code
- It follows security best practices
- It's flexible for different environments
- It centralizes credential management


### Given a distributed system that experiences latencies and occasional failures in one of its microservices, how would you optimize it? Describe your approach to identifying the problem, possible solutions, and how you would ensure high availability and resilience

R//I use an open circuit pattern, that would prevent it from continuing to receive traffic when something breaks while the service is restored. That way we control the resilience of the system.