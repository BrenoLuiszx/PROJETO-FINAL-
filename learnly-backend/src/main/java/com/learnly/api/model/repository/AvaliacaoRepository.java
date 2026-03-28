package com.learnly.api.model.repository;

import com.learnly.api.model.entity.Avaliacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AvaliacaoRepository extends JpaRepository<Avaliacao, Long> {
    List<Avaliacao> findByCursoId(Long cursoId);
    Optional<Avaliacao> findByUsuarioIdAndCursoId(Long usuarioId, Long cursoId);

    @Query("SELECT AVG(CAST(a.nota AS double)) FROM Avaliacao a WHERE a.cursoId = :cursoId")
    Double mediaNotaPorCurso(@Param("cursoId") Long cursoId);

    @Query("SELECT COUNT(a) FROM Avaliacao a WHERE a.cursoId = :cursoId")
    Integer totalAvaliacoesPorCurso(@Param("cursoId") Long cursoId);
}
