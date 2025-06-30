package com.FoodBridgeBangladesh;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
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
								"http://localhost:3000",  // Development
								"https://foodbridge-frontend.onrender.com", // Production (update with actual URL)
								"https://*.onrender.com"  // Allow all Render subdomains during testing
						)
						.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
						.allowedHeaders("*")
						.allowCredentials(true);
			}
		};
	}
}

// Add Health Check Controller
@RestController
class HealthController {

	@GetMapping("/health")
	public ResponseEntity<Map<String, String>> health() {
		Map<String, String> status = new HashMap<>();
		status.put("status", "UP");
		status.put("service", "FoodBridge Bangladesh Backend");
		status.put("timestamp", Instant.now().toString());
		return ResponseEntity.ok(status);
	}
}