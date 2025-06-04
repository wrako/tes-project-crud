package org.example.crud.service;

import lombok.RequiredArgsConstructor;
import org.example.crud.entity.Offer;
import org.example.crud.entity.Product;
import org.example.crud.repo.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .toList();
    }

    public String createProduct(Product product) {
        productRepository.save(product);
        return "Product created " + product.getName();
    }

    public String deleteProduct(Product product) {
        productRepository.delete(product);
        return "Product deleted " + product.getName();
    }

    public String update(Product product) {
        productRepository.findByName(product.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(product.getId())) {
                throw new RuntimeException("Product with name '" + product.getName() + "' already exists");
            }
        });

        productRepository.save(product);
        return "Product updated " + product.getName();
    }


}
