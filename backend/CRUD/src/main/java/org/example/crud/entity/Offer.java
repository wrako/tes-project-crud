package org.example.crud.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Offer {

    public Offer(String customerName,
                 String note,
                 LocalDate validUntil,
                 Double discountPercent,
                 BigDecimal price,
                 User user,
                 List<OfferItem> items) {

        this.customerName = customerName;
        this.note = note;
        this.validUntil = validUntil;
        this.discountPercent = discountPercent;
        this.price = price;
        this.user = user;
        this.items = items;
    }

    @Id
    @GeneratedValue
    private Long id;

    private String customerName;
    private String note;
    private LocalDate validUntil;
    private Double discountPercent;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer quantity;


    @ManyToOne
    private User user;

    @OneToMany(mappedBy = "offer", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OfferItem> items = new ArrayList<>();
}
