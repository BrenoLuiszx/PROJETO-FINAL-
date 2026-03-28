package com.learnly.api.controller;

import com.learnly.api.dto.UsuarioDTO;
import com.learnly.api.model.entity.Usuario;
import com.learnly.api.model.service.UsuarioService;
import com.learnly.api.model.service.ProgressoService;
import com.learnly.api.model.service.CertificadoService;
import com.learnly.api.model.service.AvaliacaoService;
import com.learnly.api.model.repository.CursoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ProgressoService progressoService;

    @Autowired
    private CertificadoService certificadoService;

    @Autowired
    private AvaliacaoService avaliacaoService;

    @Autowired
    private CursoRepository cursoRepository;

    // Listar todos (admin)
    @GetMapping
    public ResponseEntity<Map<String, Object>> listarUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(Map.of(
            "message", "Learnly API funcionando",
            "total", usuarios.size(),
            "usuarios", usuarios
        ));
    }

    // Registrar novo usuário
    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> registrar(@RequestBody Usuario usuario) {
        try {
            UsuarioDTO dto = usuarioService.registrar(usuario);
            return ResponseEntity.ok(dto);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Login - retorna JWT + dados do usuário
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String senha = credentials.get("senha");
            Map<String, Object> result = usuarioService.login(email, senha);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email ou senha inválidos"));
        }
    }

    // Usuário solicita ser colaborador
    @PostMapping("/{id}/solicitar-colaborador")
    public ResponseEntity<UsuarioDTO> solicitarColaborador(@PathVariable Long id,
                                                           @RequestBody Map<String, String> body) {
        try {
            String justificativa = body.getOrDefault("justificativa", "");
            return ResponseEntity.ok(usuarioService.solicitarColaborador(id, justificativa));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin lista solicitações pendentes
    @GetMapping("/solicitacoes/pendentes")
    public ResponseEntity<List<UsuarioDTO>> listarSolicitacoesPendentes() {
        return ResponseEntity.ok(usuarioService.listarSolicitacoesPendentes());
    }

    // Admin aprova colaborador
    @PutMapping("/solicitacoes/{id}/aprovar")
    public ResponseEntity<UsuarioDTO> aprovarColaborador(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.aprovarColaborador(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Admin recusa colaborador
    @PutMapping("/solicitacoes/{id}/recusar")
    public ResponseEntity<UsuarioDTO> recusarColaborador(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.recusarColaborador(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Endpoint temporário para gerar hash BCrypt
    @GetMapping("/gerar-hash/{senha}")
    public ResponseEntity<String> gerarHash(@PathVariable String senha) {
        return ResponseEntity.ok(usuarioService.gerarHash(senha));
    }

    // Atualizar foto
    @PutMapping("/{id}/foto")
    public ResponseEntity<UsuarioDTO> atualizarFoto(@PathVariable Long id,
                                                     @RequestBody Map<String, String> fotoData) {
        try {
            return ResponseEntity.ok(usuarioService.atualizarFoto(id, fotoData.get("foto")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Atualizar perfil (nome, bio)
    @PutMapping("/{id}/perfil")
    public ResponseEntity<UsuarioDTO> atualizarPerfil(@PathVariable Long id,
                                                       @RequestBody Map<String, String> dados,
                                                       Authentication auth) {
        try {
            Long authId = (Long) auth.getCredentials();
            if (!authId.equals(id)) return ResponseEntity.status(403).build();
            return ResponseEntity.ok(usuarioService.atualizarPerfil(id, dados.get("nome"), dados.get("bio")));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Dashboard do usuário - stats consolidadas
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> dashboard(Authentication auth) {
        Long usuarioId = (Long) auth.getCredentials();
        long totalCursos = cursoRepository.countByAtivoTrueAndStatus("aprovado");
        var concluidos = progressoService.listarConcluidosPorUsuario(usuarioId);
        long totalConcluidos = concluidos.size();
        long certificados = certificadoService.listarPorUsuario(usuarioId).size();
        int totalMinutos = concluidos.stream()
                .mapToInt(p -> cursoRepository.findById(p.getCursoId())
                        .map(c -> c.getDuracao()).orElse(0))
                .sum();

        return ResponseEntity.ok(Map.of(
            "totalCursos", totalCursos,
            "cursosAcessados", totalConcluidos,
            "concluidos", totalConcluidos,
            "certificados", certificados,
            "totalMinutos", totalMinutos
        ));
    }
}
