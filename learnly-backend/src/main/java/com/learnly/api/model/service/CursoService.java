package com.learnly.api.model.service;

import com.learnly.api.dto.CursoDTO;
import com.learnly.api.dto.CursoDetalhadoDTO;
import com.learnly.api.model.entity.Aula;
import com.learnly.api.model.entity.Categoria;
import com.learnly.api.model.entity.Curso;
import com.learnly.api.model.entity.Instrutor;
import com.learnly.api.model.repository.AulaRepository;
import com.learnly.api.model.repository.CategoriaRepository;
import com.learnly.api.model.repository.CursoRepository;
import com.learnly.api.model.repository.InstrutorRepository;
import com.learnly.api.model.repository.ProgressoAulaRepository;
import com.learnly.api.model.repository.ProgressoRepository;

import com.learnly.api.model.repository.AvaliacaoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Autowired
    private InstrutorRepository instrutorRepository;

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;
    
    @Autowired
    private AulaRepository aulaRepository;
    
    @Autowired
    private ProgressoAulaRepository progressoAulaRepository;
    
    @Autowired
    private ProgressoRepository progressoRepository;

    // Lista apenas cursos aprovados (público)
    public List<CursoDTO> listarTodos() {
        return cursoRepository.findByAtivoTrueAndStatus("aprovado").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Lista cursos pendentes (admin)
    public List<CursoDTO> listarPendentes() {
        return cursoRepository.findByStatus("pendente").stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Lista cursos do colaborador
    public List<CursoDTO> listarPorCriador(Long criadorId) {
        return cursoRepository.findByCriadorId(criadorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // Criar curso - admin aprova direto, colaborador fica pendente
    @Transactional
    public CursoDTO criar(CursoDTO cursoDTO, Long criadorId, String role) {
        Categoria categoria = categoriaRepository.findByNome(cursoDTO.getCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Instrutor instrutor = instrutorRepository.findByNome(cursoDTO.getInstrutor())
                .orElseGet(() -> {
                    Instrutor novo = new Instrutor(cursoDTO.getInstrutor(), "Instrutor");
                    return instrutorRepository.save(novo);
                });

        Curso curso = new Curso(
            cursoDTO.getTitulo(),
            cursoDTO.getDescricao(),
            cursoDTO.getUrl(),
            categoria,
            instrutor,
            cursoDTO.getDuracao()
        );

        curso.setCriadorId(criadorId);
        curso.setImagem(cursoDTO.getImagem());
        curso.setDescricaoDetalhada(cursoDTO.getDescricaoDetalhada());
        curso.setLinksExternos(cursoDTO.getLinksExternos());
        curso.setAnexos(cursoDTO.getAnexos());

        // Admin aprova direto, colaborador fica pendente
        if ("admin".equals(role)) {
            curso.setStatus("aprovado");
        } else {
            curso.setStatus("pendente");
        }

        Curso cursoSalvo = cursoRepository.save(curso);
        
        // Criar primeira aula automaticamente
        criarPrimeiraAula(cursoSalvo);
        
        return convertToDTO(cursoSalvo);
    }

    // Atualizar curso - colaborador só pode editar os seus
    public CursoDTO atualizar(Long id, CursoDTO cursoDTO, Long criadorId, String role) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));

        // Colaborador só pode editar seus próprios cursos
        if ("colaborador".equals(role) && !criadorId.equals(curso.getCriadorId())) {
            throw new RuntimeException("Sem permissão para editar este curso");
        }

        Categoria categoria = categoriaRepository.findByNome(cursoDTO.getCategoria())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Instrutor instrutor = instrutorRepository.findByNome(cursoDTO.getInstrutor())
                .orElseGet(() -> {
                    Instrutor novo = new Instrutor(cursoDTO.getInstrutor(), "Instrutor");
                    return instrutorRepository.save(novo);
                });

        curso.setTitulo(cursoDTO.getTitulo());
        curso.setDescricao(cursoDTO.getDescricao());
        curso.setUrl(cursoDTO.getUrl());
        curso.setCategoria(categoria);
        curso.setInstrutor(instrutor);
        curso.setDuracao(cursoDTO.getDuracao());
        curso.setImagem(cursoDTO.getImagem());
        curso.setDescricaoDetalhada(cursoDTO.getDescricaoDetalhada());
        curso.setLinksExternos(cursoDTO.getLinksExternos());
        curso.setAnexos(cursoDTO.getAnexos());

        // Colaborador ao editar volta para pendente
        if ("colaborador".equals(role)) {
            curso.setStatus("pendente");
        }

        return convertToDTO(cursoRepository.save(curso));
    }

    // Admin aprova curso
    public CursoDTO aprovarCurso(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        curso.setStatus("aprovado");
        return convertToDTO(cursoRepository.save(curso));
    }

    // Admin rejeita curso
    public CursoDTO rejeitarCurso(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        curso.setStatus("rejeitado");
        return convertToDTO(cursoRepository.save(curso));
    }

    @Transactional
    public void deletar(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        
        // Deletar progresso do curso (tabela antiga)
        progressoRepository.deleteByCursoId(id);
        
        // Deletar progresso das aulas
        progressoAulaRepository.deleteByCursoId(id);
        
        // Deletar aulas do curso
        aulaRepository.deleteByCursoId(id);
        
        // Deletar o curso
        cursoRepository.delete(curso);
    }

    public List<CursoDTO> buscarPorCategoria(String categoria) {
        return cursoRepository.findByCategoriaNome(categoria).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<CursoDTO> buscarPorTitulo(String titulo) {
        if (titulo == null || titulo.trim().isEmpty()) return listarTodos();
        return cursoRepository.buscarPorTermo(titulo).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CursoDetalhadoDTO buscarDetalhadoPorId(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso não encontrado"));
        return convertToDetalhadoDTO(curso);
    }

    private CursoDTO convertToDTO(Curso curso) {
        CursoDTO dto = new CursoDTO(
            curso.getId(),
            curso.getTitulo(),
            curso.getDescricao(),
            curso.getUrl(),
            curso.getCategoria().getNome(),
            curso.getInstrutor().getNome(),
            curso.getDuracao()
        );
        dto.setStatus(curso.getStatus());
        dto.setCriadorId(curso.getCriadorId());
        dto.setImagem(curso.getImagem());
        dto.setDescricaoDetalhada(curso.getDescricaoDetalhada());
        dto.setLinksExternos(curso.getLinksExternos());
        dto.setAnexos(curso.getAnexos());
        dto.setMediaAvaliacao(avaliacaoRepository.mediaNotaPorCurso(curso.getId()));
        dto.setTotalAvaliacoes(avaliacaoRepository.totalAvaliacoesPorCurso(curso.getId()));
        return dto;
    }

    private CursoDetalhadoDTO convertToDetalhadoDTO(Curso curso) {
        CursoDetalhadoDTO dto = new CursoDetalhadoDTO(
            curso.getId(),
            curso.getTitulo(),
            curso.getDescricao(),
            curso.getUrl(),
            curso.getCategoria().getNome(),
            curso.getInstrutor().getNome(),
            curso.getInstrutor().getFoto(),
            curso.getInstrutor().getBio(),
            curso.getDuracao(),
            "Online"
        );
        dto.setImagem(curso.getImagem());
        dto.setDescricaoDetalhada(curso.getDescricaoDetalhada());
        dto.setLinksExternos(curso.getLinksExternos());
        dto.setAnexos(curso.getAnexos());
        dto.setStatus(curso.getStatus());
        dto.setMediaAvaliacao(avaliacaoRepository.mediaNotaPorCurso(curso.getId()));
        dto.setTotalAvaliacoes(avaliacaoRepository.totalAvaliacoesPorCurso(curso.getId()));
        return dto;
    }
    
    // Método auxiliar para criar primeira aula automaticamente
    private void criarPrimeiraAula(Curso curso) {
        try {
            // Verificar se já existe aula para este curso
            long totalAulas = aulaRepository.countByCursoId(curso.getId());
            if (totalAulas > 0) {
                System.out.println("[CursoService] Curso já possui aulas, pulando criação automática");
                return;
            }
            
            Aula primeiraAula = new Aula();
            primeiraAula.setCursoId(curso.getId());
            primeiraAula.setOrdem(1);
            primeiraAula.setTitulo("Aula 1 - " + curso.getTitulo());
            primeiraAula.setUrl(curso.getUrl());
            primeiraAula.setDescricao("Aula principal do curso");
            
            aulaRepository.save(primeiraAula);
            System.out.println("[CursoService] Primeira aula criada automaticamente para curso: " + curso.getId());
        } catch (Exception e) {
            System.err.println("[CursoService] Erro ao criar primeira aula: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
