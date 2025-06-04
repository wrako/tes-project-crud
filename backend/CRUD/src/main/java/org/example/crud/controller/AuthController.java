package org.example.crud.controller;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.example.crud.dto.AuthRequest;
import org.example.crud.dto.AuthResponse;
import org.example.crud.entity.User;
import org.example.crud.repo.UserRepository;
import org.example.crud.security.JwtUtil;
import org.example.crud.service.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public String register(@RequestBody AuthRequest request) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username is already in use";
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setVerified(false); // важная часть
        user.getRoles().add("GUEST");

        userRepository.save(user);

        // Готовим ссылку с токеном (если у тебя уже есть механизм генерации токенов)
        String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());
        String verifyLink = "http://localhost:8080/api/auth/verify-email?token=" + token;

        // Отправка письма
        emailService.sendEmail(user.getEmail(), "Verify your email", "Click here to verify your account: " + verifyLink);

        return "Verification email sent.";
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {

            User user = userRepository.findByUsername(request.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found"));

//            if(request.getUsername().equals("admin")){
//
//                user.getRoles().add("ADMIN");
//                user.getRoles().add("USER");
//                user.getRoles().add("GUEST");
//                userRepository.save(user);
//                System.out.println("==================================================================");
//                System.out.println("==================================================================");
//                System.out.println(user.getRoles().toString());
//                System.out.println("==================================================================");
//                System.out.println("==================================================================");
//
//
//            }
//            if(request.getUsername().equals("oper")){
//                user.getRoles().add("OPERATOR");
//                user.getRoles().add("ADMIN");
//                user.getRoles().add("USER");
//                user.getRoles().add("GUEST");
//                userRepository.save(user);
//
//
//            }
//            if(request.getUsername().equals("user") || request.getUsername().equals("martin")){
//                user.getRoles().add("USER");
//                user.getRoles().add("GUEST");
//                userRepository.save(user);
//
//            }


//            if (!user.isVerified()) {
//                return ResponseEntity
//                        .status(HttpStatus.FORBIDDEN)
//                        .body("Email not verified");
//            }

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String token = jwtUtil.generateToken(user.getUsername(), user.getRoles());
            return ResponseEntity.ok(new AuthResponse(token));

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }


    @GetMapping("/verify-email")
    public void verifyEmail(@RequestParam("token") String token, HttpServletResponse response) throws IOException {
        String username;
        try {
            username = jwtUtil.extractUsername(token);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid or expired token");
            return;
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getRoles().contains("USER")) {
            user.getRoles().add("USER");
            userRepository.save(user);
        }

        // Редирект на фронтенд-страницу логина
        response.sendRedirect("http://localhost:3000/login");
    }



}


