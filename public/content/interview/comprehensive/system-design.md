# System Design Interview Questions [Medium]

## Question 1: CAP Theorem

In CAP theorem, which combination is actually achievable?

- A) Consistency + Availability + Partition Tolerance (all 3)
- B) Consistency + Availability (in absence of partitions)
- C) Consistency + Partition Tolerance
- D) Availability + Partition Tolerance

**Answer:** B

## Question 2: Load Balancing

What is the difference between sticky sessions and session affinity?

- A) They are completely different concepts
- B) Sticky sessions are a type of session affinity implementation
- C) Session affinity is hardware-based, sticky sessions are software-based
- D) No difference, they are synonyms

**Answer:** B

## Question 3: Database Scaling

When would you choose denormalization over normalization?

- A) When data integrity is paramount
- B) When read performance is critical and joins are expensive
- C) When storage space is limited
- D) Always, normalization is outdated

**Answer:** B

## Question 4: Caching

What is cache stampede and how do you prevent it?

- A) Too many cache hits; use more RAM
- B) Multiple requests regenerating same cache item simultaneously; use mutex/lock or cache warming
- C) Cache data becoming stale; use shorter TTLs
- D) Cache eviction under pressure; disable eviction

**Answer:** B

## Question 5: Microservices

What is the purpose of an API Gateway?

- A) Replace all backend services
- B) Single entry point for all client requests, handling routing, auth, rate limiting
- C) Store API documentation
- D) Monitor API response times only

**Answer:** B
