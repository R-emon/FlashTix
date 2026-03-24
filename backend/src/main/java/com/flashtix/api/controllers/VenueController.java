package com.flashtix.api.controllers;

import com.flashtix.api.models.dto.VenueRequest;
import com.flashtix.api.models.dto.VenueResponse;
import com.flashtix.api.models.entities.Venue;
import com.flashtix.api.services.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    // Public endpoint: Anyone can see venues
    @GetMapping
    public ResponseEntity<List<VenueResponse>> getAllVenues() {
        List<VenueResponse> responses = venueService.getAllVenues().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // Admin only endpoint
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<VenueResponse> createVenue(@Valid @RequestBody VenueRequest request) {
        Venue newVenue = venueService.createVenue(request);
        return new ResponseEntity<>(mapToResponse(newVenue), HttpStatus.CREATED);
    }

    // Helper method to convert an internal Entity to our safe Response DTO
    private VenueResponse mapToResponse(Venue venue) {
        return VenueResponse.builder()
                .id(venue.getId())
                .name(venue.getName())
                .address(venue.getAddress())
                .capacity(venue.getCapacity())
                .build();
    }
}
