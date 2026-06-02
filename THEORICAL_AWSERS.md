# Theoretical Answers - Quizzes

This file contains selected answers for the requested quizzes, each with a brief justification.

## Quiz Answers

1. **What verb should you choose for retrieving trade orders with the API server?**  
    **Answer:** `GET`  
    *Justification:* The standard HTTP verb for safe, read-only operations; appropriate for retrieving resources.

2. **Which of the following API paths should you use?**  
    **Answer:** `/contacts/{contact_id}`  
    *Justification:* Resource-oriented path using a unique identifier; agnostic to contact role and extensible.

3. **Which HTTP error code(s) should you use to keep the system secure and still report that an error occurred?**  
    **Answer:** `401`  
    *Justification:* Use for both non-existent users and wrong passwords; avoids revealing user existence, reducing information for attackers.

4. **True or false: You should put a fake UUID into the example code (instead of just the text "UUID") as a placeholder.**  
    **Answer:** `TRUE`  
    *Justification:* Helps readers understand the expected format and reduces ambiguity.

5. **How much work should your method, handleErrors(response), handle?**  
    **Answer:** Check for the presence of an error and throw an exception if found.  
    *Justification:* Keeps the method focused and testable; allows callers to decide how to react.

6. **Which way should you implement this error handling?**  
    **Answer:** Driver-based error provider for all classes that can issue errors.  
    *Justification:* Centralizes error handling and increases consistency.

7. **Which of the following should you use to name your method?**  
    **Answer:** `parseDataForProducts()`  
    *Justification:* Expresses a single responsibility (parsing data for products).

8. **What strategy should you use to store and access these credentials?**  
    **Answer:** Store in a `.env` file, load into a configuration system, and request credentials from a database service provider.  
    *Justification:* Secure, flexible, and scalable approach.

---

## Scenario Analysis

**Context:**  
In a distributed system, one microservice experiences latency spikes and occasional failures. The goal is to optimize for availability and resilience.

**Identification:**  
- Use monitoring and logging to pinpoint root causes (e.g., slow database queries, high CPU usage, external API failures).

**Solutions:**  
- Scale the service horizontally (add more instances).
- Add caching for frequent requests.
- Optimize inefficient code or database queries.
- Implement resilience patterns:
  - Retries with backoff for temporary issues.
  - Circuit breaker to stop calling failing dependencies.

**Ensuring Resilience:**  
- Run redundant service instances to handle failures.
- Use automated systems (e.g., Kubernetes) to restart failed services.
- Design for graceful degradation to maintain core functionality during partial outages.

