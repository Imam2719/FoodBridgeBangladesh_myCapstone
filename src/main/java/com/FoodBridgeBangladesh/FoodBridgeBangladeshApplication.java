package com.FoodBridgeBangladesh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;
import java.time.Instant;
import java.sql.Connection;

@SpringBootApplication
public class FoodBridgeBangladeshApplication {

	public static void main(String[] args) {
		SpringApplication.run(FoodBridgeBangladeshApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/api/**")
						.allowedOrigins(
								"http://localhost:3000",
								"https://foodbridge-frontend.onrender.com",
								"https://*.onrender.com"
						)
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}
}

@RestController
class HealthController {
	
	@Autowired(required = false)
	private DataSource dataSource;
	
	@GetMapping("/health")
	public ResponseEntity<Map<String, String>> health() {
		Map<String, String> status = new HashMap<>();
		status.put("status", "UP");
		status.put("service", "FoodBridge Bangladesh Backend");
		status.put("timestamp", Instant.now().toString());
		
		// Test database connection
		if (dataSource != null) {
			try {
				Connection connection = dataSource.getConnection();
				status.put("database", "CONNECTED");
				status.put("databaseUrl", connection.getMetaData().getURL());
				connection.close();
			} catch (Exception e) {
				status.put("database", "FAILED");
				status.put("databaseError", e.getMessage());
			}
		} else {
			status.put("database", "NO_DATASOURCE");
		}
		
		return ResponseEntity.ok(status);
	}
}
