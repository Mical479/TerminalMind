# JVM Interview Questions [Medium]

## Question 1: Memory Allocation

What is the difference between heap and stack memory in JVM?

- A) Heap stores objects, stack stores primitives and references
- B) Heap is thread-private, stack is shared across threads
- C) Stack uses garbage collection, heap doesn't
- D) They are the same thing

**Answer:** A

## Question 2: Garbage Collection

Which GC algorithm is known for its "pause time" predictability?

- A) Serial GC
- B) Parallel GC
- C) G1 GC
- D) ZGC

**Answer:** C

## Question 3: Class Loader

What is the order of class loader delegation?

- A) Application → Extension → Bootstrap
- B) Bootstrap → Extension → Application
- C) Extension → Application → Bootstrap
- D) Depends on configuration

**Answer:** B

## Question 4: JIT Compilation

When does JIT compilation occur?

- A) During class loading
- B) After a method is called a certain number of times
- C) Only at startup
- D) Never, Java is interpreted only

**Answer:** B

## Question 5: Memory Leaks

Which of these can cause memory leaks in Java?

- A) Unclosed database connections
- B) Static collections holding references
- C) Unclosed streams
- D) All of the above

**Answer:** D
