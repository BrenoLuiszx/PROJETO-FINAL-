package com.learnly.api.model.service;

import com.learnly.api.model.entity.Avaliacao;
import com.learnly.api.model.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AvaliacaoService {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    public Avaliacao salvar(Long usuarioId, Long cursoId, Integer nota, String comentario, String nomeUsuario) {
        if (nota < 1 || nota > 5) throw new RuntimeException("Nota deve ser entre 1 e 5");

        Avaliacao avaliacao = avaliacaoRepository.findByUsuarioIdAndCursoId(usuarioId, cursoId)
                .orElse(new Avaliacao());

        avaliacao.setUsuarioId(usuarioId);
        avaliacao.setCursoId(cursoId);
        avaliacao.setNota(nota);
        avaliacao.setComentario(comentario);
        avaliacao.setNomeUsuario(nomeUsuario);
        return avaliacaoRepository.save(avaliacao);
    }

    public List<Avaliacao> listarPorCurso(Long cursoId) {
        return avaliacaoRepository.findByCursoId(cursoId);
    }

    public Double mediaPorCurso(Long cursoId) {
        Double media = avaliacaoRepository.mediaNotaPorCurso(cursoId);
        return media != null ? Math.round(media * 10.0) / 10.0 : 0.0;
    }

    public Integer totalPorCurso(Long cursoId) {
        Integer total = avaliacaoRepository.totalAvaliacoesPorCurso(cursoId);
        return total != null ? total : 0;
    }

    public Avaliacao buscarDoUsuario(Long usuarioId, Long cursoId) {
        return avaliacaoRepository.findByUsuarioIdAndCursoId(usuarioId, cursoId).orElse(null);
    }
}
