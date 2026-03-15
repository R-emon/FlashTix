package com.flashtix.api.services;

import com.flashtix.api.models.dto.OrderRequest;
import com.flashtix.api.models.entities.Order;
import com.flashtix.api.models.entities.Ticket;
import com.flashtix.api.models.entities.User;
import com.flashtix.api.repositories.OrderRepository;
import com.flashtix.api.repositories.TicketRepository;
import com.flashtix.api.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final RedisLockService redisLockService;

    @Transactional
    public Order createOrder(OrderRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Ticket> ticketsToPurchase = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (Long ticketId : request.getTicketIds()) {

            boolean isLocked = redisLockService.lockTicket(ticketId, user.getId());

            if (!isLocked) {
                throw new RuntimeException("Ticket " + ticketId + " is currently reserved by someone else!");
            }

            Ticket ticket = ticketRepository.findById(ticketId)
                    .orElseThrow(() -> new RuntimeException("Ticket " + ticketId + " does not exist"));

            if (!"AVAILABLE".equals(ticket.getStatus())) {
                throw new RuntimeException("Ticket " + ticketId + " is no longer available.");
            }

            ticket.setStatus("RESERVED"); // Temporarily reserved until payment is successful
            ticket.setUser(user);
            ticket.setReservationExpiresAt(LocalDateTime.now().plusMinutes(15));

            ticketsToPurchase.add(ticket);
            totalAmount = totalAmount.add(ticket.getPrice());
        }

        // 7. Create the actual Order parent record
        Order order = Order.builder()
                .user(user)
                .totalAmount(totalAmount)
                .status("PENDING_PAYMENT")
                .paymentIntentId("pi_" + UUID.randomUUID().toString())
                .build();

        Order savedOrder = orderRepository.save(order);

        // Associate all these modified tickets to the parent order and save them
        for (Ticket ticket : ticketsToPurchase) {
            ticket.setOrder(savedOrder);
        }
        ticketRepository.saveAll(ticketsToPurchase);

        return savedOrder;
    }
}
