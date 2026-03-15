package com.flashtix.api.services;

import com.flashtix.api.models.dto.EventRequest;
import com.flashtix.api.models.entities.Event;
import com.flashtix.api.models.entities.Ticket;
import com.flashtix.api.models.entities.Venue;
import com.flashtix.api.repositories.EventRepository;
import com.flashtix.api.repositories.TicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueService venueService; // We inject VenueService to find the venue
    private final TicketRepository ticketRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
    }

    // @Transactional ensures that if ticket generation fails, the entire event creation rolls back!
    @Transactional
    public Event createEvent(EventRequest request) {

        // 1. Find the venue
        Venue venue = venueService.getVenueById(request.getVenueId());

        // 2. Validate capacity
        if (request.getTotalTickets() > venue.getCapacity()) {
            throw new RuntimeException("Total tickets cannot exceed venue capacity");
        }

        // 3. Create the Event
        Event event = Event.builder()
                .venue(venue)
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .totalTickets(request.getTotalTickets())
                .availableTickets(request.getTotalTickets())
                .status("PUBLISHED")
                .build();

        Event savedEvent = eventRepository.save(event);

        // 4. Bulk generate all Tickets for this Event
        List<Ticket> tickets = new ArrayList<>();
        for (int i = 1; i <= request.getTotalTickets(); i++) {
            Ticket ticket = Ticket.builder()
                    .event(savedEvent)
                    .seatIdentifier("General Admission - Seat " + i)
                    .price(request.getTicketPrice())
                    .status("AVAILABLE")
                    .build();
            tickets.add(ticket);
        }
        ticketRepository.saveAll(tickets);

        return savedEvent;
    }
}
