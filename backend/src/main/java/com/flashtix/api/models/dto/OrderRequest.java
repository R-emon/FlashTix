package com.flashtix.api.models.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty(message = "You must select at least one ticket")
    private List<Long> ticketIds;

}
