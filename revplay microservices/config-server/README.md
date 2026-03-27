# Config Server

RevPlay Spring Cloud Config Server with Git backend

## Description
This is the Spring Cloud Config Server for the RevPlay microservices architecture. It provides centralized configuration management for all microservices using a Git repository as the backend.

## Configuration
- **Port**: 8888
- **Application Name**: config-server
- **Git Repository**: https://github.com/your-username/revplay-config-repo.git
- **Search Path**: config/

## Running the Server

### Using Maven
```bash
mvn spring-boot:run
```

### Using Java
```bash
mvn clean package
java -jar target/config-server-1.0.0.jar
```

## Git Repository Setup
1. Create a Git repository for configurations
2. Create a `config` folder in the repository
3. Add configuration files in the format: `{service-name}-{profile}.properties`
4. Update the `spring.cloud.config.server.git.uri` in application.properties

## Example Configuration Files
```
config/
├── eureka-server-dev.properties
├── config-server-dev.properties
├── user-service-dev.properties
├── catalog-service-dev.properties
└── api-gateway-dev.properties
```

## Accessing Configuration
Once the server is running, configurations can be accessed at:
- http://localhost:8888/{application}/{profile}/{label}
- Example: http://localhost:8888/user-service/dev/main

## Eureka Integration
The Config Server registers itself with Eureka and can be discovered by other services.
