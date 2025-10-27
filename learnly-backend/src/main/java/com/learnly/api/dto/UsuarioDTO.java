package com.learnly.api.dto;

public class UsuarioDTO {
    private Long id;
    private String nome;
    private String email;
    private String foto;
    private String role;

    // Construtores
    public UsuarioDTO() {}

    public UsuarioDTO(Long id, String nome, String email, String foto, String role) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.foto = foto;
        this.role = role;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}