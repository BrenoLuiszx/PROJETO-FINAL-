package com.learnly.api.model.service;

import com.learnly.api.dto.UsuarioDTO;
import com.learnly.api.model.entity.Usuario;
import com.learnly.api.model.repository.UsuarioRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public List<UsuarioDTO> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UsuarioDTO registrar(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("Email já cadastrado");
        }
        
        // Definir role baseado no email
        if (usuario.getEmail().toLowerCase().contains("admin")) {
            usuario.setRole("admin");
        } else {
            usuario.setRole("user");
        }
        
        Usuario usuarioSalvo = usuarioRepository.save(usuario);
        return convertToDTO(usuarioSalvo);
    }

    public UsuarioDTO login(String email, String senha) {
        Optional<Usuario> usuario = usuarioRepository.findByEmailAndSenha(email, senha);
        if (usuario.isPresent()) {
            return convertToDTO(usuario.get());
        }
        throw new RuntimeException("Email ou senha inválidos");
    }

    public UsuarioDTO atualizarFoto(Long id, String foto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setFoto(foto);
            Usuario usuarioAtualizado = usuarioRepository.save(usuario);
            return convertToDTO(usuarioAtualizado);
        }
        throw new RuntimeException("Usuário não encontrado");
    }

    private UsuarioDTO convertToDTO(Usuario usuario) {
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getNome(),
            usuario.getEmail(),
            usuario.getFoto(),
            usuario.getRole()
        );
    }
}