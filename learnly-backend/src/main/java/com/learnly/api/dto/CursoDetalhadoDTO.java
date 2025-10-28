package com.learnly.api.dto;

public class CursoDetalhadoDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String url;
    private String categoria;
    private String instrutor;
    private String instrutorFoto;
    private String instrutorBio;
    private Integer duracao;
    private String formaAplicacao;

    // Construtores
    public CursoDetalhadoDTO() {}

    public CursoDetalhadoDTO(Long id, String titulo, String descricao, String url, String categoria, 
                           String instrutor, String instrutorFoto, String instrutorBio, Integer duracao, String formaAplicacao) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.url = url;
        this.categoria = categoria;
        this.instrutor = instrutor;
        this.instrutorFoto = instrutorFoto;
        this.instrutorBio = instrutorBio;
        this.duracao = duracao;
        this.formaAplicacao = formaAplicacao;
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

    public String getInstrutorFoto() { return instrutorFoto; }
    public void setInstrutorFoto(String instrutorFoto) { this.instrutorFoto = instrutorFoto; }

    public String getInstrutorBio() { return instrutorBio; }
    public void setInstrutorBio(String instrutorBio) { this.instrutorBio = instrutorBio; }

    public Integer getDuracao() { return duracao; }
    public void setDuracao(Integer duracao) { this.duracao = duracao; }

    public String getFormaAplicacao() { return formaAplicacao; }
    public void setFormaAplicacao(String formaAplicacao) { this.formaAplicacao = formaAplicacao; }
}