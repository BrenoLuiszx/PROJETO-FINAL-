package com.learnly.api.model.repository;

import com.learnly.api.model.entity.Progresso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressoRepository extends JpaRepository<Progresso, Long> {
    Optional<Progresso> findByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);
    List<Progresso> findByUsuarioId(Long usuarioId);
    List<Progresso> findByUsuarioIdAndConcluidoTrue(Long usuarioId);
    
    @Modifying
    @Transactional
    void deleteByCursoId(Long cursoId);
}
