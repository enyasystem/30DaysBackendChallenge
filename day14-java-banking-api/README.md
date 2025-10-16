# Day 14 — Java Banking API (Learning-focused)

This folder is intended as a learning playground for building a small, well-structured Java REST API that models a simple banking system (accounts, transfers, balances). The project is intentionally left empty so you can practice creating a clear structure, apply best practices, and learn by implementing features step-by-step.

This README will guide you through: a suggested project layout, tools to use, step-by-step starter tasks, how to run and test locally, and learning notes to help you reason about design choices.

## Learning goals

- Design a minimal, idiomatic Java project for a REST API
- Use a build tool (Maven or Gradle) and understand dependency management
- Write clean package-based structure: controllers, services, repositories, models
- Implement basic domain logic (accounts, deposits, withdrawals, transfers)
- Add simple validation, error handling, and tests
- Learn to run, build, and test the app locally

## Suggested tech choices (pick one)

- Java 17 or later (LTS)
- Framework: Spring Boot (recommended for learning REST APIs) or a lightweight alternative like Javalin or Spark for minimal boilerplate
- Build: Maven (pom.xml) or Gradle (build.gradle)
- Testing: JUnit 5 and Mockito

If you're learning enterprise-style apps and dependency injection, use Spring Boot. If you prefer seeing fewer frameworks and more plain Java, use Javalin.

## Recommended project layout

Use a conventional Maven/Gradle layout:

day14-java-banking-api/
- README.md
- pom.xml   or build.gradle
- src/
  - main/
    - java/
      - com.yourname.bankapi/
        - Application.java          (app entry / SpringBootApplication)
        - controller/
          - AccountController.java
        - service/
          - AccountService.java
        - repository/
          - InMemoryAccountRepository.java
        - model/
          - Account.java
          - TransferRequest.java
        - dto/
          - AccountDto.java
        - exception/
          - ApiException.java
    - resources/
      - application.properties
  - test/
    - java/
      - com.yourname.bankapi/
        - AccountServiceTest.java

This structure separates responsibilities and makes it easy to explain each layer.

## Minimal contract (what you'll implement first)

- Inputs: HTTP JSON requests
  - Create account: POST /accounts { "owner": "Alice", "initialBalance": 100 }
  - Get account: GET /accounts/{id}
  - Transfer: POST /accounts/transfer { "fromId": 1, "toId": 2, "amount": 10 }
- Outputs: JSON responses and appropriate HTTP codes (200/201/400/404/422)
- Error modes: validation errors, insufficient funds, not found, internal errors

## Starter tasks (step-by-step)

1. Initialize project
   - Create a Maven or Gradle project targeting Java 17.
   - Add Spring Boot starter web and validation dependencies (or Javalin if you prefer).

2. Create the domain model
   - `Account` with id (long/UUID), owner, and balance (BigDecimal).

3. Repository layer (start in-memory)
   - `InMemoryAccountRepository` with thread-safe map and basic CRUD operations.

4. Service layer
   - `AccountService` exposing create, find, deposit, withdraw, transfer.
   - Ensure transfers are atomic in the service (synchronized logic or lock by account id).

5. Controller layer
   - `AccountController` mapping REST endpoints to service calls.
   - Add input validation (amount > 0, account ids present).

6. Tests
   - Unit test `AccountService` for happy path and edge cases (insufficient funds, concurrent transfers).

7. Improve
   - Replace in-memory repo with a simple JDBC or H2-based repository.
   - Add integration tests using SpringBootTest or an embedded server.

## How to run (Spring Boot / Maven example)

1. Ensure Java 17 is installed.
2. From project root run:

```bash
# build
mvn clean package

# run
mvn spring-boot:run
```

Open http://localhost:8080 and try endpoints with curl or Postman.

Example curl commands:

```bash
# create account
curl -X POST -H "Content-Type: application/json" \
  -d '{"owner":"Alice","initialBalance":100}' \
  http://localhost:8080/accounts

# transfer
curl -X POST -H "Content-Type: application/json" \
  -d '{"fromId":1,"toId":2,"amount":10}' \
  http://localhost:8080/accounts/transfer
```

## Best-practice tips (for learning)

- Keep domain types pure — use BigDecimal for money and avoid floating-point types.
- Small, focused tests: test service logic independently of web layer.
- Error handling: return meaningful HTTP status codes and messages.
- Thread-safety: think about concurrent transfers; practice locking strategies.
- DTOs: map internal domain objects to DTOs for API boundaries.
- Logging: add structured logs at service boundaries and error cases.

## Suggested learning checkpoints

- Checkpoint 1: App runs and you can create & fetch accounts.
- Checkpoint 2: Implement transfer and test insufficient funds scenario.
- Checkpoint 3: Add tests for concurrent transfers and reason about locking.
- Checkpoint 4: Swap in-memory repo with H2 and add integration tests.
