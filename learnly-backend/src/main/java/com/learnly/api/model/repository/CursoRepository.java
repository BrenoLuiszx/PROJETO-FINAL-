package com.learnly.api.model.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.learnly.api.model.entity.Curso;

import java.util.List;

@Repository
public interface CursoRepository extends JpaRepository<Curso, Long> {
    
    @Query("SELECT c FROM Curso c WHERE c.categoria.nome = :categoria AND c.ativo = true")
    List<Curso> findByCategoriaNome(@Param("categoria") String categoria);
    
    @Query("SELECT c FROM Curso c WHERE " +
           "(LOWER(c.titulo) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.descricao) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.instrutor.nome) LIKE LOWER(CONCAT('%', :termo, '%')) OR " +
           "LOWER(c.categoria.nome) LIKE LOWER(CONCAT('%', :termo, '%'))) " +
           "AND c.ativo = true")
    List<Curso> buscarPorTermo(@Param("termo") String termo);
    
    List<Curso> findByAtivoTrue();
}