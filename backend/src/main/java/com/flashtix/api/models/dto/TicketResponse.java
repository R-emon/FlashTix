package com.flashtix.api.models.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class TicketResponse {
    private Long id;
    private String seatIdentifier;
    private BigDecimal price;
    private String status;
}
