package com.flashtix.api.services;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RedisLockService {

    private final RedisTemplate<String, Object> redisTemplate;

    // Attempts to lock a ticket for 15 minutes. Returns true if successful.
    public boolean lockTicket(Long ticketId, Long userId) {
        String key = "ticket:lock:" + ticketId;

        // setIfAbsent is equivalent to SETNX in Redis. It only writes if the key doesn't exist.
        Boolean success = redisTemplate.opsForValue()
                .setIfAbsent(key, userId, Duration.ofMinutes(15));

        return Boolean.TRUE.equals(success);
    }

    public void unlockTicket(Long ticketId) {
        String key = "ticket:lock:" + ticketId;
        redisTemplate.delete(key);
    }
}
