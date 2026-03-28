package com.learnly.api.controller;

import com.learnly.api.model.entity.Progresso;
import com.learnly.api.model.service.ProgressoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/progresso")
public class ProgressoController {

    @Autowired
    private ProgressoService progressoService;

    @PostMapping("/cursos/{cursoId}/concluir")
    public ResponseEntity<Progresso> marcarConcluido(@PathVariable Long cursoId, Authentication auth) {
        Long usuarioId = (Long) auth.getCredentials();
        return ResponseEntity.ok(progressoService.marcarConcluido(usuarioId, cursoId));
    }

    // Mantém DELETE para compatibilidade + adiciona POST alternativo
    @DeleteMapping("/cursos/{cursoId}/concluir")
    public ResponseEntity<Progresso> desmarcarConcluidoDelete(@PathVariable Long cursoId, Authentication auth) {
        Long usuarioId = (Long) auth.getCredentials();
        return ResponseEntity.ok(progressoService.desmarcarConcluido(usuarioId, cursoId));
    }

    @PostMapping("/cursos/{cursoId}/desconcluir")
    public ResponseEntity<Progresso> desmarcarConcluido(@PathVariable Long cursoId, Authentication auth) {
        Long usuarioId = (Long) auth.getCredentials();
        return ResponseEntity.ok(progressoService.desmarcarConcluido(usuarioId, cursoId));
    }

    @GetMapping("/meus")
    public ResponseEntity<List<Progresso>> meuProgresso(Authentication auth) {
        Long usuarioId = (Long) auth.getCredentials();
        return ResponseEntity.ok(progressoService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/meus/concluidos")
    public ResponseEntity<List<Progresso>> meusConcluidos(Authentication auth) {
        Long usuarioId = (Long) auth.getCredentials();
        return ResponseEntity.ok(progressoService.listarConcluidosPorUsuario(usuarioId));
    }

    @GetMapping("/cursos/{cursoId}/status")
    public ResponseEntity<Map<String, Boolean>> statusCurso(@PathVariable Long cursoId, Authentication auth) {
        Long usuarioId = (Long) auth.getCredentials();
        boolean concluido = progressoService.isConcluido(usuarioId, cursoId);
        return ResponseEntity.ok(Map.of("concluido", concluido));
    }
}
