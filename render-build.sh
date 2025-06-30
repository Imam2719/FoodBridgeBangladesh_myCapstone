#!/usr/bin/env bash
set -o errexit

echo "Building FoodBridge Bangladesh Backend..."
./mvnw clean package -DskipTests
echo "Build completed successfully!"