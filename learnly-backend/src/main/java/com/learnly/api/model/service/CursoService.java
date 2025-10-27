package com.learnly.api.model.service;

import com.learnly.api.dto.CursoDTO;
import com.learnly.api.model.entity.Categoria;
import com.learnly.api.model.entity.Curso;
import com.learnly.api.model.entity.Instrutor;
import com.learnly.api.model.repository.CategoriaRepository;
import com.learnly.api.model.repository.CursoRepository;
import com.learnly.api.model.repository.InstrutorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;
    
    @Autowired
    private CategoriaRepository categoriaRepository;
    
    @Autowired
    private InstrutorRepository instrutorRepository;

    public List<CursoDTO> listarTodos() {
        return cursoRepository.findByAtivoTrue().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CursoDTO criar(CursoDTO cursoDTO) {
        Categoria categoria = categoriaRepository.findByNome(cursoDTO.getCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        Instrutor instrutor = instrutorRepository.findByNome(cursoDTO.getInstrutor())
                .orElseGet(() -> {
                    Instrutor novoInstrutor = new Instrutor(cursoDTO.getInstrutor(), "Instrutor");
                    return instrutorRepository.save(novoInstrutor);
                });

        Curso curso = new Curso(
            cursoDTO.getTitulo(),
            cursoDTO.getDescricao(),
            cursoDTO.getUrl(),
            categoria,
            instrutor,
            cursoDTO.getDuracao()
        );

        Curso cursoSalvo = cursoRepository.save(curso);
        return convertToDTO(cursoSalvo);
    }

    public CursoDTO atualizar(Long id, CursoDTO cursoDTO) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        Categoria categoria = categoriaRepository.findByNome(cursoDTO.getCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
        
        Instrutor instrutor = instrutorRepository.findByNome(cursoDTO.getInstrutor())
                .orElseGet(() -> {
                    Instrutor novoInstrutor = new Instrutor(cursoDTO.getInstrutor(), "Instrutor");
                    return instrutorRepository.save(novoInstrutor);
                });

        curso.setTitulo(cursoDTO.getTitulo());
        curso.setDescricao(cursoDTO.getDescricao());
        curso.setUrl(cursoDTO.getUrl());
        curso.setCategoria(categoria);
        curso.setInstrutor(instrutor);
        curso.setDuracao(cursoDTO.getDuracao());

        Curso cursoAtualizado = cursoRepository.save(curso);
        return convertToDTO(cursoAtualizado);
    }

    public void deletar(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        cursoRepository.delete(curso);
    }

    public List<CursoDTO> buscarPorCategoria(String categoria) {
        return cursoRepository.findByCategoriaNome(categoria).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CursoDTO> buscarPorTitulo(String titulo) {
        if (titulo == null || titulo.trim().isEmpty()) {
            return listarTodos();
        }
        return cursoRepository.buscarPorTermo(titulo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private CursoDTO convertToDTO(Curso curso) {
        return new CursoDTO(
            curso.getId(),
            curso.getTitulo(),
            curso.getDescricao(),
            curso.getUrl(),
            curso.getCategoria().getNome(),
            curso.getInstrutor().getNome(),
            curso.getDuracao()
        );
    }
}