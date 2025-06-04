package org.example.crud.controller;

import lombok.RequiredArgsConstructor;
import org.example.crud.entity.Product;
import org.example.crud.service.ProductService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public String createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping
    public String updateProduct(@RequestBody Product updatedProduct) {
        return productService.update(updatedProduct);
    }

    @DeleteMapping
    public String deleteProduct(@RequestBody Product product) {
        return productService.deleteProduct(product);
    }
}
