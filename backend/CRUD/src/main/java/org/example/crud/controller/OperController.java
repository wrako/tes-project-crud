package org.example.crud.controller;

import lombok.RequiredArgsConstructor;
import org.example.crud.dto.UserSummaryDTO;
import org.example.crud.entity.Product;
import org.example.crud.entity.User;
import org.example.crud.service.UserDetailsServiceImpl;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/oper")
@RequiredArgsConstructor
@PreAuthorize("hasRole('OPERATOR')")
public class OperController {

    UserDetailsServiceImpl userDetailsService;

    @GetMapping
    public List<UserSummaryDTO> getAllUsers() {
        return userDetailsService.getAllUsers();
    }

    @PostMapping
    public String addUsersRole(@RequestParam String username, @RequestParam String role) {
        User user = userDetailsService.loadUser(username);
        user.getRoles().add(role);
        return "success";
    }

    @DeleteMapping
    public String removeUsersRole(@RequestParam String username, @RequestParam String role) {
        User user = userDetailsService.loadUser(username);
        user.getRoles().remove(role);
        return "success";

    }


}
