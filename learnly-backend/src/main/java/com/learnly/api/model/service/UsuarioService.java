package com.learnly.api.model.service;

import com.learnly.api.dto.UsuarioDTO;
import com.learnly.api.model.entity.Usuario;
import com.learnly.api.model.repository.UsuarioRepository;
import com.learnly.api.security.JwtService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Lista usuários com solicitação pendente de colaborador
    public List<UsuarioDTO> listarSolicitacoesPendentes() {
        return usuarioRepository.findByStatusSolicitacao("pendente").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }

        // Criptografa a senha
        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));

        if (usuario.getEmail().toLowerCase().contains("admin")) {
            usuario.setRole("admin");
        } else {
            usuario.setRole("user");
        }

        Usuario salvo = usuarioRepository.save(usuario);
        return convertToDTO(salvo);
    }

    // Login retorna token JWT
    public Map<String, Object> login(String email, String senha) {
        Optional<Usuario> opt = usuarioRepository.findByEmail(email);
        if (opt.isEmpty()) throw new RuntimeException("Email ou senha inválidos");

        Usuario usuario = opt.get();

        // Verifica senha com BCrypt
        System.out.println("[DEBUG] Senha digitada: '" + senha + "'");
        System.out.println("[DEBUG] Hash no banco: '" + usuario.getSenha() + "'");
        System.out.println("[DEBUG] Matches: " + passwordEncoder.matches(senha, usuario.getSenha()));
        if (!passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Email ou senha inválidos");
        }

        String token = jwtService.gerarToken(usuario.getId(), usuario.getEmail(), usuario.getRole());

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("token", token);
        response.put("usuario", convertToDTO(usuario));
        return response;
    }

    // Usuário solicita ser colaborador
    public UsuarioDTO solicitarColaborador(Long id, String justificativa) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if ("colaborador".equals(usuario.getRole()) || "admin".equals(usuario.getRole())) {
            throw new RuntimeException("Usuário já é colaborador ou admin");
        }

        usuario.setStatusSolicitacao("pendente");
        usuario.setJustificativaColaborador(justificativa);
        return convertToDTO(usuarioRepository.save(usuario));
    }

    // Admin aprova solicitação
    public UsuarioDTO aprovarColaborador(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setRole("colaborador");
        usuario.setStatusSolicitacao("aprovada");
        return convertToDTO(usuarioRepository.save(usuario));
    }

    // Admin recusa solicitação
    public UsuarioDTO recusarColaborador(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        usuario.setStatusSolicitacao("recusada");
        return convertToDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO atualizarFoto(Long id, String foto) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        usuario.setFoto(foto);
        return convertToDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO atualizarPerfil(Long id, String nome, String bio) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        if (nome != null && !nome.trim().isEmpty()) usuario.setNome(nome.trim());
        return convertToDTO(usuarioRepository.save(usuario));
    }

    public String gerarHash(String senha) {
        return passwordEncoder.encode(senha);
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getFoto(),
            usuario.getRole(),
            usuario.getStatusSolicitacao(),
            usuario.getJustificativaColaborador()
        );
    }
}
