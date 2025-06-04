package org.example.crud.repo;

import org.example.crud.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public Optional<Product> findByName(String name);
}

