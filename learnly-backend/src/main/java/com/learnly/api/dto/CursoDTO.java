package com.learnly.api.dto;

public class CursoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String url;
    private String categoria;
    private String instrutor;
    private Integer duracao;

    // Construtores
    public CursoDTO() {}

    public CursoDTO(Long id, String titulo, String descricao, String url, String categoria, String instrutor, Integer duracao) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.url = url;
        this.categoria = categoria;
        this.instrutor = instrutor;
        this.duracao = duracao;
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getInstrutor() { return instrutor; }
    public void setInstrutor(String instrutor) { this.instrutor = instrutor; }

    public Integer getDuracao() { return duracao; }
    public void setDuracao(Integer duracao) { this.duracao = duracao; }
}