package org.example.crud.service;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.example.crud.dto.OfferFilter;
import org.example.crud.entity.Offer;
import org.example.crud.entity.OfferItem;
import org.example.crud.entity.Product;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class OfferSpecifications {

    public static Specification<Offer> withFilter(OfferFilter filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getCustomerName() != null) {
                predicates.add(cb.like(cb.lower(root.get("customerName")), "%" + filter.getCustomerName().toLowerCase() + "%"));
            }

            if (filter.getUsername() != null) {
                predicates.add(cb.equal(root.get("user").get("username"), filter.getUsername()));
            }

            if (filter.getDate() != null) {
                predicates.add(cb.equal(root.get("validUntil"), filter.getDate()));
            }

            if (filter.getPriceFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filter.getPriceFrom()));
            }

            if (filter.getPriceTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filter.getPriceTo()));
            }

            if (filter.getDiscountPercentFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("discountPercent"), filter.getDiscountPercentFrom()));
            }

            if (filter.getDiscountPercentTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("discountPercent"), filter.getDiscountPercentTo()));
            }

            if (filter.getProductsNames() != null && !filter.getProductsNames().isEmpty()) {
                Join<Offer, OfferItem> itemsJoin = root.join("items");
                // JOIN offer_item ot on ot.offer_id = o.id
                Join<OfferItem, Product> productJoin = itemsJoin.join("product");
                predicates.add(productJoin.get("name").in(filter.getProductsNames()));
                assert query != null;
                query.distinct(true);
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
