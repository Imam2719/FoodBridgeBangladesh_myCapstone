package com.FoodBridgeBangladesh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Value;
import java.util.HashMap;
import java.util.Map;
import java.time.Instant;

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
	
	@Value("${spring.application.name:FoodBridge Bangladesh Backend}")
	private String applicationName;
	
	@Value("${server.port:8080}")
	private String serverPort;
	
	@GetMapping("/health")
	public ResponseEntity<Map<String, String>> health() {
		Map<String, String> status = new HashMap<>();
		status.put("status", "UP");
		status.put("service", applicationName);
		status.put("timestamp", Instant.now().toString());
		status.put("port", serverPort);
		status.put("message", "Application is running successfully");
		
		return ResponseEntity.ok(status);
	}
	
	@GetMapping("/")
	public ResponseEntity<Map<String, String>> root() {
		Map<String, String> response = new HashMap<>();
		response.put("message", "Welcome to FoodBridge Bangladesh API");
		response.put("status", "Active");
		response.put("timestamp", Instant.now().toString());
		response.put("healthCheck", "/health");
		response.put("apiBase", "/api");
		
		return ResponseEntity.ok(response);
	}
}
