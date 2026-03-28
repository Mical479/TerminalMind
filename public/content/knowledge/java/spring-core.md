# Spring Core Concepts

## Dependency Injection (DI)

Dependency Injection is a design pattern where the container injects dependencies into a bean rather than the bean creating them itself.

### Types of DI

- **Constructor Injection**: Dependencies provided via constructor
- **Setter Injection**: Dependencies provided via setter methods
- **Field Injection**: Dependencies injected directly into fields (not recommended)

### Example

```java
@Service
public class UserService {
    private final UserRepository userRepository;
    
    // Constructor Injection (recommended)
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

## IoC Container

The Inversion of Control (IoC) container manages:
- Bean lifecycle
- Dependency injection
- Bean scopes

### Bean Scopes

| Scope | Description |
|-------|-------------|
| singleton | One instance per Spring container |
| prototype | New instance each time requested |
| request | One instance per HTTP request |
| session | One instance per HTTP session |
| application | One instance per ServletContext |

## AOP (Aspect-Oriented Programming)

AOP separates cross-cutting concerns from business logic.

### Key Concepts

- **Aspect**: Module with cross-cutting behavior
- **Join Point**: Point in program execution
- **Advice**: Action taken by aspect
- **Pointcut**: Expression matching join points

### Advice Types

1. @Before - Run before method
2. @After - Run after method (finally)
3. @AfterReturning - Run after successful return
4. @AfterThrowing - Run after exception
5. @Around - Wrap method execution
