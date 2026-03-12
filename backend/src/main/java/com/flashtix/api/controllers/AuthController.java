package com.flashtix.api.controllers;

import com.flashtix.api.models.dto.AuthResponse;
import com.flashtix.api.models.dto.LoginRequest;
import com.flashtix.api.models.dto.RegisterRequest;
import com.flashtix.api.models.entities.User;
import com.flashtix.api.repositories.UserRepository;
import com.flashtix.api.security.CustomUserDetails;
import com.flashtix.api.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {

        // 1. Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Error: Email is already taken!");
        }

        // 2. Create the User Entity and Hash the Password
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER") // Default role. We'd manually change one admin in DB later
                .build();

        // 3. Save to database
        userRepository.save(user);

        // 4. Generate Token (we wrap it in CustomUserDetails so the JWT utility understands it)
        String jwtToken = jwtUtil.generateToken(new CustomUserDetails(user));

        // 5. Send Response back
        AuthResponse response = AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole())
                .build();

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {

        // 1. Let Spring Security attempt the login with email and raw password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. If it succeeds, grab the CustomUserDetails from the Auth object
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // 3. Generate token
        String jwtToken = jwtUtil.generateToken(userDetails);

        // 4. Send Response back
        AuthResponse response = AuthResponse.builder()
                .token(jwtToken)
                .email(userDetails.getUsername())
                .firstName(userDetails.getUser().getFirstName())
                .lastName(userDetails.getUser().getLastName())
                .role(userDetails.getUser().getRole())
                .build();

        return ResponseEntity.ok(response);
    }
}
