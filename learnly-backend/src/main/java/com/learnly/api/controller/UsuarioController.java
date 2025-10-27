package com.learnly.api.controller;

import com.learnly.api.dto.UsuarioDTO;
import com.learnly.api.model.entity.Usuario;
import com.learnly.api.model.service.UsuarioService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> listarUsuarios() {
        List<UsuarioDTO> usuarios = usuarioService.listarTodos();
        return ResponseEntity.ok(Map.of(
            "message", "Learnly API funcionando",
            "total", usuarios.size(),
            "usuarios", usuarios
        ));
    }

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> registrar(@RequestBody Usuario usuario) {
        try {
            UsuarioDTO usuarioDTO = usuarioService.registrar(usuario);
            return ResponseEntity.ok(usuarioDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String senha = credentials.get("senha");
            UsuarioDTO usuario = usuarioService.login(email, senha);
            return ResponseEntity.ok(Map.of("usuario", usuario));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Email ou senha inválidos"));
        }
    }

    @PutMapping("/{id}/foto")
    public ResponseEntity<UsuarioDTO> atualizarFoto(@PathVariable Long id, @RequestBody Map<String, String> fotoData) {
        try {
            String foto = fotoData.get("foto");
            UsuarioDTO usuario = usuarioService.atualizarFoto(id, foto);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}