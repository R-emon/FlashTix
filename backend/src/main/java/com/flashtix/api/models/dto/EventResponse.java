package com.flashtix.api.models.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class EventResponse {
    private Long id;
    private String venueName; // We only expose the name, not the whole Venue entity
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer totalTickets;
    private Integer availableTickets;
    private String status;
}
