package org.example.crud.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class UserSummaryDTO {
    private Long id;
    private String username;
    private List<String> roles;



}
