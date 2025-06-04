package org.example.crud.controller;

import lombok.RequiredArgsConstructor;
import org.example.crud.dto.OfferFilter;
import org.example.crud.entity.Offer;
import org.example.crud.service.OfferService;
import org.example.crud.service.UserDetailsServiceImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OfferController {

    private final OfferService offerService;

    private final UserDetailsServiceImpl userDetailsService;


    @PostMapping("/get")
    public Page<Offer> getOffersPage(@RequestBody OfferFilter filter, Pageable pageable) {
        return offerService.getOffersPage(filter, pageable);
    }

    @PostMapping
    public String createOffer(@RequestBody Offer offer, Principal principal) {
        offer.setUser(userDetailsService.getCurrentUser(principal));
        return offerService.createOffer(offer);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'OPERATOR')")
    @DeleteMapping
    public String deleteOffers(@RequestBody List<Long> ids, Principal principal) {
        if (userDetailsService.getCurrentUser(principal).getRoles()
                        .stream().noneMatch(role -> role.equals("ADMIN") || role.equals("OPERATOR"))) {
            for (Long id : ids) {
                Offer offer = offerService.getOfferById(id);
                if(!Objects.equals(offer.getUser().getId(), userDetailsService.getCurrentUser(principal).getId())) {
                    return "Not enough permission, offer can only be deleted by admin or oper";
                }
            }
        }

         return offerService.deleteOffersByIds(ids);
    }

    @PreAuthorize("hasAnyRole('ADMIN', 'USER', 'OPERATOR')")
    @PostMapping("/edit")
    public String updateOffers(@RequestParam Long id, @RequestBody Offer offer, Principal principal) {

        if (userDetailsService.getCurrentUser(principal).getRoles()
                .stream().noneMatch(role -> role.equals("ADMIN") || role.equals("OPERATOR"))) {
            Offer upoffer = offerService.getOfferById(id);
            if(Objects.equals(upoffer.getUser().getId(), userDetailsService.getCurrentUser(principal).getId())) {
                return "Not enough permission, offer can only be edited by admin or oper";
            }

        }

        return offerService.updateOffer(id, offer);
    }

    

}
