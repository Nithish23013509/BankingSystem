# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

# ── Stage 2: Run ────────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/bankingsystem-0.0.1-SNAPSHOT.jar app.jar

# Render provides PORT dynamically (usually 10000), don't hardcode it
ENV PORT=10000
EXPOSE ${PORT}

ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}"]
