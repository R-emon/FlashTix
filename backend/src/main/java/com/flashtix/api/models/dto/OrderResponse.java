package com.flashtix.api.models.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Long orderId;
    private String userEmail;
    private BigDecimal totalAmount;
    private String status;
    private String paymentIntentId;
    private LocalDateTime createdAt;

    private List<String> seatIdentifiers;
}
