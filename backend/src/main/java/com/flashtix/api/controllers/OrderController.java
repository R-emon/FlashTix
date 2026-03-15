package com.flashtix.api.controllers;

import com.flashtix.api.models.dto.OrderRequest;
import com.flashtix.api.models.dto.OrderResponse;
import com.flashtix.api.models.entities.Order;
import com.flashtix.api.models.entities.Ticket;
import com.flashtix.api.services.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        // The service now returns the safe DTO directly!
        OrderResponse safeResponse = orderService.createOrder(request, userEmail);

        return new ResponseEntity<>(safeResponse, HttpStatus.CREATED);
    }
}
