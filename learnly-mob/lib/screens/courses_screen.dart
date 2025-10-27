import 'package:flutter/material.dart';
import '../main.dart';

class CoursesScreen extends StatefulWidget {
  final Function(Screen) onNavigate;

  const CoursesScreen({super.key, required this.onNavigate});

  @override
  State<CoursesScreen> createState() => _CoursesScreenState();
}

class _CoursesScreenState extends State<CoursesScreen> {
  final _searchController = TextEditingController();
  String? selectedLevel;

  final courses = [
    {
      'id': 1,
      'title': 'JavaScript Completo',
      'description': 'Curso completo de React do iniciação ao avançado',
      'level': 'Iniciante',
      'duration': '6h 30min',
      'instructor': 'MatPaz EdTech ou Boteco',
      'category': 'Desenvolvimento'
    },
    {
      'id': 2,
      'title': 'Figma para Iniciantes',
      'description': 'Aprenda design criando uma API REST',
      'level': 'Iniciante',
      'duration': '4h 15min',
      'instructor': 'Interatividade Acelerada',
      'category': 'Design'
    },
    {
      'id': 3,
      'title': 'Python Fundamentos',
      'description': 'Curso de Python para Data Science',
      'level': 'Intermediário',
      'duration': '8h 15min',
      'instructor': 'Cravo em Video',
      'category': 'Programação'
    },
    {
      'id': 4,
      'title': 'Recursos Modernos ES6+',
      'description': 'Recursos modernos do JavaScript',
      'level': 'Avançado',
      'duration': '5h 45min',
      'instructor': 'Código',
      'category': 'Desenvolvimento'
    },
    {
      'id': 5,
      'title': 'Spring Boot API',
      'description': 'Crie APIs REST com Spring Boot',
      'level': 'Avançado',
      'duration': '10h 30min',
      'instructor': 'DevDojo',
      'category': 'Backend'
    },
  ];

  final levels = ['Iniciante', 'Intermediário', 'Avançado'];

  List<Map<String, dynamic>> get filteredCourses {
    return courses.where((course) {
      final matchesSearch = (course['title'] as String).toLowerCase().contains(_searchController.text.toLowerCase()) ||
          (course['description'] as String).toLowerCase().contains(_searchController.text.toLowerCase());
      final matchesLevel = selectedLevel == null || course['level'] == selectedLevel;
      return matchesSearch && matchesLevel;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: Column(
        children: [
          // Header
          Container(
            color: const Color(0xFF18181B),
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Logo
                Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: const Color(0xFFFACC15),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Icon(
                        Icons.school,
                        color: Colors.black,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Text(
                      'LEARNLY',
                      style: TextStyle(
                        color: Color(0xFFFACC15),
                        fontSize: 16,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 2,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),

                const Text(
                  'Catálogo de Cursos',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'A plataforma de cursos mais avançada do Brasil. Conteúdo exclusivo, instrutores renomados e tecnologia de ponta para acelerar sua carreira.',
                  style: TextStyle(
                    color: Color(0xFF9CA3AF),
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 24),

                // Search
                TextField(
                  controller: _searchController,
                  onChanged: (value) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Buscar seu próximo aprendizado... (Exemplo: React)',
                    hintStyle: const TextStyle(color: Color(0xFF6B7280)),
                    prefixIcon: const Icon(Icons.search, color: Color(0xFF6B7280)),
                    filled: true,
                    fillColor: const Color(0xFF27272A),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFF374151)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFF374151)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: const BorderSide(color: Color(0xFFFACC15)),
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                  ),
                  style: const TextStyle(color: Colors.white),
                ),
              ],
            ),
          ),

          // Filters
          Container(
            color: Colors.black,
            padding: const EdgeInsets.all(16),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  const Icon(Icons.filter_list, color: Color(0xFF9CA3AF), size: 16),
                  const SizedBox(width: 8),
                  _buildFilterChip('Todos', null),
                  ...levels.map((level) => _buildFilterChip(level, level)),
                ],
              ),
            ),
          ),

          // Courses List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(24),
              itemCount: filteredCourses.length,
              itemBuilder: (context, index) {
                final course = filteredCourses[index];
                return Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color(0xFF18181B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF27272A)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFACC15),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              course['category'] as String,
                              style: const TextStyle(
                                color: Colors.black,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          Text(
                            course['duration'] as String,
                            style: const TextStyle(
                              color: Color(0xFF9CA3AF),
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        course['title'] as String,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        course['description'] as String,
                        style: const TextStyle(
                          color: Color(0xFF9CA3AF),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Instrutor: ${course['instructor']}',
                        style: const TextStyle(
                          color: Color(0xFF6B7280),
                          fontSize: 14,
                        ),
                      ),
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 40,
                        child: ElevatedButton(
                          onPressed: () {},
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFFACC15),
                            foregroundColor: Colors.black,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                          child: const Text(
                            'Começar Curso',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String? value) {
    final isSelected = selectedLevel == value;
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: () => setState(() => selectedLevel = value),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFFFACC15) : Colors.transparent,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected ? const Color(0xFFFACC15) : const Color(0xFF374151),
            ),
          ),
          child: Text(
            label,
            style: TextStyle(
              color: isSelected ? Colors.black : const Color(0xFF9CA3AF),
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}