package com.flashtix.api.controllers;

import com.flashtix.api.models.dto.VenueRequest;
import com.flashtix.api.models.entities.Venue;
import com.flashtix.api.services.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/venues")
@RequiredArgsConstructor
public class VenueController {

    private final VenueService venueService;

    // Public endpoint: Anyone can see venues
    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        return ResponseEntity.ok(venueService.getAllVenues());
    }

    // Admin only endpoint
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Venue> createVenue(@Valid @RequestBody VenueRequest request) {
        Venue newVenue = venueService.createVenue(request);
        return new ResponseEntity<>(newVenue, HttpStatus.CREATED);
    }
}
