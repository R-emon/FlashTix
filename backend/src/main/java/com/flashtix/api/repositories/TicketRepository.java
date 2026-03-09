package com.flashtix.api.repositories;

import com.flashtix.api.models.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // Custom query to find all available tickets for a specific event
    @Query("SELECT t FROM Ticket t WHERE t.event.id = :eventId AND t.status = 'AVAILABLE'")
    List<Ticket> findAvailableTicketsByEventId(@Param("eventId") Long eventId);
}
