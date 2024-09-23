# Backend Developer Technical Test

## Problem Resolution

Given an array of integers, maintain a total score based on the following rules:

1. Add 1 point for every even number in the array
2. Add 3 points for every odd number in the array, except for the number "5"
3. Add 5 points every time the number "5" appears in the array

Note: 0 is considered even.

### Implementation

```javascript
function calculateScore(array) {
    let score = 0;
    for (let i = 0; i < array.length; i++) {
        let num = array[i];
        if (num === 5) {
            score += 5;
        } else if (num % 2 === 0) {
            score += 1; 
        } else {
            score += 3;
        }
    }
    return score;
}
```

## Test Cases

```javascript
console.log(calculateScore([1, 2, 3, 4, 5])); // Output: 13
console.log(calculateScore([17, 19, 21])); // Output: 9
console.log(calculateScore([5, 5, 5])); // Output: 15
```


## Theoretical Answers

### 1️⃣ What verb should you choose for retrieving trade orders with the API server?


**Q:** You're building a high-throughput API for a cryptocurrency trading platform. For
this platform, time is extremely important because microseconds count when
processing high-volume trade orders. For communicating with the API, you want
to choose the verb that is fastest for read-only operations.

**A:** GET

### 2️⃣ Which of the following API paths should you use?

**Q:** You work for a Customer Relationship Management CRM company. The
company's clients gain CRM access through a RESTful API. The CRM allows
clients to add contact information for customers, prospects, and related persons
(e.g., virtual assistants or marketing directors). You want to choose an
appropriate API request path so clients can easily retrieve information for a
single contact while also being flexible for future software changes.


**A:** /contacts/{contact_id}

### 3️⃣ Which HTTP error code(s) should you use to keep the system secure and still report that an error occurred?


**Q:** You work for a large social media network, and you've been tasked with error
handling for the API. You're trying to decide on an appropriate error code for
authentication failures based on non-existent users and incorrect passwords.
You want to balance security against brute force attacks with providing
descriptive and true error codes.


**A:** 404 if the user doesn't exist, 403 if the password is wrong

### 4️⃣ True or false: You should put a fake UUID into the example code (instead of just the text "UUID") as a placeholder

**Q:** You're writing documentation for requesting information about a given user in
your system. Your system uses UUIDS (universally unique identifiers) as user
identifiers. In your documentation, you want to show an example.

**A:** TRUE

### 5️⃣ How much work should your method, handleErrors(response), handle?

**Q:** You're building code to handle errors issued from a remote API server. The
response may or may not have an error.

**A:** Check for an error. If it exists, set it as a class property and then throw an exception.

### 6️⃣ Which way should you implement this error handling?

**Q:** You have two classes: a database driver and an email driver. Both classes need
to set errors so that your front-end interface displays any errors that transpire
on your platform.

**A:** Make a trait to handle errors so it'll collect errors in any class that uses it

### 7️⃣ Which of the following should you use to name your method?

**Q:** You need to name the private method in your class that handles looping through
eCommerce products to collect and parse data. That data gets stored in an array
and set as a class property.

**A:**  parseDataForProducts()

### 8️⃣ What strategy should you use to store and access these credentials?

**Q:**There are multiple places in your codebase that need to access the database. To
access the database, you need to supply credentials. You want to balance
security with useability.

**A:** Put them in a .env file, load data from it into a configuration system, then
request the credentials from a database service provider.


## Scenario Analysis
Optimizing a Distributed System
To optimize a distributed system experiencing latencies and occasional failures in its microservices, I propose...

📌**Deployment in Multiple Regions:**
Deploying microservices in multiple regions or availability zones ensures service continuity in case of regional failures. This helps distribute the load and improve latency by bringing services closer to end users.

📌**Caching:**
Implementing caching mechanisms, such as Redis or Memcached, allows for storing common responses and reducing the load on the microservice. This improves performance by decreasing response times for frequent requests.

📌**Use of Containers and Orchestrators:**
Considering the use of containers (Docker) facilitates load management and scalability of microservices. This enables a more flexible and efficient infrastructure, making it easier to implement changes and updates.