package com.flashtix.api.controllers;

import com.flashtix.api.models.dto.OrderRequest;
import com.flashtix.api.models.entities.Order;
import com.flashtix.api.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // This endpoint requires any standard logged-in user
    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<Order> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication // This automatically grabs the JWT token data
    ) {
        // authentication.getName() returns the email since we set that as the username in CustomUserDetails
        String userEmail = authentication.getName();

        Order newOrder = orderService.createOrder(request, userEmail);

        return new ResponseEntity<>(newOrder, HttpStatus.CREATED);
    }
}
