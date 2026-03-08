package com.flashtix.api.models.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    // nullable = true because a ticket may not be owned by anyone yet
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false)
    private String seatIdentifier; // e.g. "Row A - Seat 12"

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private String status; // "AVAILABLE", "RESERVED", "SOLD"

    private LocalDateTime reservationExpiresAt;

    // OPTIMISTIC LOCKING: This prevents the double booking problem exactly at the DB row level
    @Version
    private Integer version;
}
