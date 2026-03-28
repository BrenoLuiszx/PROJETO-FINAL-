package com.learnly.api.config;

import com.learnly.api.security.JwtFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Preflight CORS
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Rotas públicas
                .requestMatchers(HttpMethod.POST, "/api/usuarios/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/usuarios/registrar").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/usuarios/gerar-hash/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/cursos").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/cursos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/avaliacoes/cursos/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/certificados/usuario/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/aulas/curso/**").permitAll()
                // Rotas apenas admin
                .requestMatchers(HttpMethod.POST, "/api/aulas/curso/**").hasAnyRole("ADMIN", "COLABORADOR")
                .requestMatchers(HttpMethod.DELETE, "/api/cursos/**").hasRole("ADMIN")
                .requestMatchers("/api/usuarios/solicitacoes/**").hasRole("ADMIN")
                .requestMatchers("/api/cursos/pendentes").hasRole("ADMIN")
                .requestMatchers("/api/cursos/*/aprovar").hasRole("ADMIN")
                .requestMatchers("/api/cursos/*/rejeitar").hasRole("ADMIN")
                // Rotas colaborador e admin
                .requestMatchers(HttpMethod.POST, "/api/cursos").hasAnyRole("ADMIN", "COLABORADOR")
                .requestMatchers(HttpMethod.PUT, "/api/cursos/**").hasAnyRole("ADMIN", "COLABORADOR")
                // Demais rotas autenticadas
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
