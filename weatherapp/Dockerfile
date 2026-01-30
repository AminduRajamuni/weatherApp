# Build stage
FROM maven:3.8.5-openjdk-17 AS build
COPY . .
RUN mvn clean package -DskipTests

# Run stage - Using eclipse-temurin instead of openjdk
FROM eclipse-temurin:17-jdk-alpine
COPY --from=build /target/*.jar demo.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "demo.jar"]