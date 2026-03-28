package com.learnly.api.model.service;

import com.learnly.api.model.entity.Progresso;
import com.learnly.api.model.repository.ProgressoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ProgressoService {

    @Autowired
    private ProgressoRepository progressoRepository;

    public Progresso marcarConcluido(Long usuarioId, Long cursoId) {
        Progresso p = progressoRepository.findByUsuarioIdAndCursoId(usuarioId, cursoId)
                .orElse(new Progresso(usuarioId, cursoId));
        p.setConcluido(true);
        p.setDataConclusao(LocalDateTime.now());
        return progressoRepository.save(p);
    }

    public Progresso desmarcarConcluido(Long usuarioId, Long cursoId) {
        Progresso p = progressoRepository.findByUsuarioIdAndCursoId(usuarioId, cursoId)
                .orElse(new Progresso(usuarioId, cursoId));
        p.setConcluido(false);
        p.setDataConclusao(null);
        return progressoRepository.save(p);
    }

    public List<Progresso> listarPorUsuario(Long usuarioId) {
        return progressoRepository.findByUsuarioId(usuarioId);
    }

    public List<Progresso> listarConcluidosPorUsuario(Long usuarioId) {
        return progressoRepository.findByUsuarioIdAndConcluidoTrue(usuarioId);
    }

    public boolean isConcluido(Long usuarioId, Long cursoId) {
        return progressoRepository.findByUsuarioIdAndCursoId(usuarioId, cursoId)
                .map(Progresso::getConcluido)
                .orElse(false);
    }
}
