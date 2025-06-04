package org.example.crud.dto;

import jakarta.persistence.ManyToOne;
import lombok.Data;
import org.example.crud.entity.User;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class OfferFilter {

    private String customerName;
    private String username;
    private LocalDate date;

    private List<String> productsNames;

    private BigDecimal price;
    private BigDecimal priceFrom;
    private BigDecimal priceTo;

    private BigDecimal discountPrice;
    private BigDecimal discountPriceFrom;
    private BigDecimal discountPriceTo;

    private Integer quantity;
    private Integer quantityFrom;
    private Integer quantityTo;

    private Double discountPercent;
    private Double discountPercentFrom;
    private Double discountPercentTo;


}
