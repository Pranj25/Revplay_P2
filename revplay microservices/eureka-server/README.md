# Eureka Server

RevPlay Eureka Service Discovery Server

## Description
This is the Eureka Server for the RevPlay microservices architecture. It provides service discovery and registration for all microservices in the RevPlay application.

## Configuration
- **Port**: 8761
- **Application Name**: eureka-server
- **Dashboard**: http://localhost:8761

## Running the Server

### Using Maven
```bash
mvn spring-boot:run
```

### Using Java
```bash
mvn clean package
java -jar target/eureka-server-1.0.0.jar
```

## Accessing Eureka Dashboard
Once the server is running, you can access the Eureka dashboard at:
http://localhost:8761

## Service Registration
Other microservices should register with this Eureka server using the following configuration:
```properties
eureka.client.service-url.defaultZone=http://localhost:8761/eureka/
```
