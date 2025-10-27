    package com.learnly.api.controller;

    import com.learnly.api.dto.CursoDTO;
import com.learnly.api.model.service.CursoService;

import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;
    import java.util.List;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/cursos")
    public class CursoController {

        @Autowired
        private CursoService cursoService;

        @GetMapping
        public ResponseEntity<List<CursoDTO>> listarCursos() {
            List<CursoDTO> cursos = cursoService.listarTodos();
            return ResponseEntity.ok(cursos);
        }

        @PostMapping
        public ResponseEntity<CursoDTO> criarCurso(@RequestBody CursoDTO cursoDTO) {
            try {
                CursoDTO curso = cursoService.criar(cursoDTO);
                return ResponseEntity.ok(curso);
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        @PutMapping("/{id}")
        public ResponseEntity<CursoDTO> atualizarCurso(@PathVariable Long id, @RequestBody CursoDTO cursoDTO) {
            try {
                CursoDTO curso = cursoService.atualizar(id, cursoDTO);
                return ResponseEntity.ok(curso);
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Map<String, String>> deletarCurso(@PathVariable Long id) {
            try {
                cursoService.deletar(id);
                return ResponseEntity.ok(Map.of("message", "Curso deletado com sucesso"));
            } catch (RuntimeException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Curso não encontrado"));
            }
        }

        @GetMapping("/categoria/{categoria}")
        public ResponseEntity<List<CursoDTO>> buscarPorCategoria(@PathVariable String categoria) {
            List<CursoDTO> cursos = cursoService.buscarPorCategoria(categoria);
            return ResponseEntity.ok(cursos);
        }

        @GetMapping("/buscar")
        public ResponseEntity<List<CursoDTO>> buscarPorTitulo(@RequestParam(required = false) String titulo) {
            List<CursoDTO> cursos = cursoService.buscarPorTitulo(titulo);
            return ResponseEntity.ok(cursos);
        }
    }