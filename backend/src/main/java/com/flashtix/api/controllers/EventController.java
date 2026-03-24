package com.flashtix.api.controllers;

import com.flashtix.api.models.dto.EventRequest;
import com.flashtix.api.models.dto.EventResponse;
import com.flashtix.api.models.entities.Event;
import com.flashtix.api.services.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    // Public endpoint
    @GetMapping
    public ResponseEntity<List<EventResponse>> getAllEvents() {
        List<EventResponse> responses = eventService.getAllEvents().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Public endpoint
    @GetMapping("/{id}")
    public ResponseEntity<EventResponse> getEventById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToResponse(eventService.getEventById(id)));
    }

    // Admin only endpoint
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody EventRequest request) {
        Event newEvent = eventService.createEvent(request);
        return new ResponseEntity<>(mapToResponse(newEvent), HttpStatus.CREATED);
    }

    // Helper method to convert an internal Entity to our safe Response DTO
    private EventResponse mapToResponse(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .venueName(event.getVenue().getName()) // WE ONLY EXPOSE THE VENUE NAME!
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .totalTickets(event.getTotalTickets())
                .availableTickets(event.getAvailableTickets())
                .status(event.getStatus())
                .build();
    }
}
