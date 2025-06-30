package com.FoodBridgeBangladesh.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(false); // Set to false when using "*"
    }

    // For React routing support, add this method

    public void addViewControllers(ViewControllerRegistry registry) {
        // Forward requests to /any-path to /
        registry.addViewController("/{path:^(?!api).*}/**")
                .setViewName("forward:/");
    }
}