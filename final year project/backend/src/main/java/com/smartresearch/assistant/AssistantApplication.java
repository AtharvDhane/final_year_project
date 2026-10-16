package com.smartresearch.assistant;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

import java.io.File;

/**
 * Main Spring Boot Application entry point for AI-Powered Smart Research & Learning Assistant.
 */
@SpringBootApplication
@EnableMongoAuditing
public class AssistantApplication {

    public static void main(String[] args) {
        // Enforce absolute persistent storage path for Embedded Mongo on disk
        File mongoDir = new File("mongo_data").getAbsoluteFile();
        if (!mongoDir.exists()) {
            mongoDir.mkdirs();
        }
        System.setProperty("de.flapdoodle.mongodb.embedded.storage.databaseDir", mongoDir.getAbsolutePath());
        System.setProperty("de.flapdoodle.mongodb.embedded.storage.database-dir", mongoDir.getAbsolutePath());

        SpringApplication.run(AssistantApplication.class, args);
    }
}
