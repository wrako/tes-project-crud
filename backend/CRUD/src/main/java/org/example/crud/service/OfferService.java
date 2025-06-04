package org.example.crud.service;

import lombok.RequiredArgsConstructor;
import org.example.crud.dto.OfferFilter;
import org.example.crud.entity.Offer;
import org.example.crud.entity.OfferItem;
import org.example.crud.repo.OfferRepository;
import org.example.crud.repo.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final ProductRepository productRepository;

    public Page<Offer> getOffersPage(OfferFilter filter, Pageable pageable) {
        return offerRepository.findAll(OfferSpecifications.withFilter(filter), pageable);
    }


    public String createOffer(Offer offer) {
        List<OfferItem> itemsToAttach = offer.getItems();
        offer.setItems(new ArrayList<>());
        Offer savedOffer = offerRepository.save(offer);

        for (OfferItem item : itemsToAttach) {
            OfferItem offerItem = new OfferItem();
            offerItem.setOffer(savedOffer);
            offerItem.setProduct(productRepository.getReferenceById(item.getProduct().getId()));
            offerItem.setQuantity(item.getQuantity());
//            System.out.println("====================================================");
//            System.out.println(item.getPrice());
//            System.out.println("====================================================");
            offerItem.setPrice(item.getPrice());

            savedOffer.getItems().add(offerItem);
        }
        offerRepository.save(savedOffer);

        return "Offer created " + savedOffer.getId();
    }

    public String updateOffer(Long id, Offer updatedOffer) {
        Offer existingOffer = offerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Offer not found with id " + id));

        existingOffer.setCustomerName(updatedOffer.getCustomerName());
        existingOffer.setNote(updatedOffer.getNote());
        existingOffer.setValidUntil(updatedOffer.getValidUntil());
        existingOffer.setDiscountPercent(updatedOffer.getDiscountPercent());
        existingOffer.setPrice(updatedOffer.getPrice());
        existingOffer.setDiscountPrice(updatedOffer.getDiscountPrice());
        existingOffer.setQuantity(updatedOffer.getQuantity());

        existingOffer.getItems().clear();

        for (OfferItem item : updatedOffer.getItems()) {
            OfferItem offerItem = new OfferItem();
            offerItem.setOffer(existingOffer);
            offerItem.setProduct(productRepository.getReferenceById(item.getProduct().getId()));
            offerItem.setQuantity(item.getQuantity());
            offerItem.setPrice(item.getPrice());
            existingOffer.getItems().add(offerItem);
        }

        offerRepository.save(existingOffer);
        return "Offer updated: " + existingOffer.getId();
    }

    public String deleteOffersByIds(List<Long> offerIds) {
        List<Offer> offersToDelete = offerRepository.findAllById(offerIds);
        offerRepository.deleteAll(offersToDelete);
        return "Offer(s) deleted";
    }

    public Offer getOfferById(Long id) {
       return offerRepository.findById(id).orElseThrow(() -> new RuntimeException("Offer not found with id " + id));
    }
}

