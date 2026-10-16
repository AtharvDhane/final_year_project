package com.smartresearch.assistant.config;

import com.smartresearch.assistant.model.User;
import com.smartresearch.assistant.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            logger.info("Seeding demo accounts into the database...");

            User admin = User.builder()
                    .name("Admin User")
                    .email("admin@axiom.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.ROLE_ADMIN)
                    .build();

            User student = User.builder()
                    .name("Student User")
                    .email("student@axiom.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.ROLE_STUDENT)
                    .build();

            User teacher = User.builder()
                    .name("Teacher User")
                    .email("teacher@axiom.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.ROLE_TEACHER)
                    .build();

            User researcher = User.builder()
                    .name("Researcher User")
                    .email("researcher@axiom.com")
                    .password(passwordEncoder.encode("password123"))
                    .role(User.Role.ROLE_RESEARCHER)
                    .build();

            userRepository.save(admin);
            userRepository.save(student);
            userRepository.save(teacher);
            userRepository.save(researcher);

            logger.info("Demo accounts seeded successfully.");
        } else {
            logger.info("Database already contains users. Skipping data seeder.");
        }
    }
}
