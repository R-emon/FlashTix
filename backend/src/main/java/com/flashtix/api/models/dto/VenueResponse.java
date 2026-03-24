package com.flashtix.api.models.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VenueResponse {
    private Long id;
    private String name;
    private String address;
    private Integer capacity;
}
