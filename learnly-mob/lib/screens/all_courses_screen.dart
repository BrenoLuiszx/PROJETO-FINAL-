import 'package:flutter/material.dart';
import '../main.dart';

class AllCoursesScreen extends StatefulWidget {
  final Function(Screen) onNavigate;

  const AllCoursesScreen({super.key, required this.onNavigate});

  @override
  State<AllCoursesScreen> createState() => _AllCoursesScreenState();
}

class _AllCoursesScreenState extends State<AllCoursesScreen> {
  final _searchController = TextEditingController();
  String? selectedCategory;

  final categories = ['Todos', 'Desenvolvimento', 'Design', 'Programação', 'Backend', 'Frontend', 'DevOps'];

  final allCourses = [
    {
      'id': 1,
      'title': 'JavaScript Completo',
      'description': 'Do básico ao avançado com projetos práticos',
      'instructor': 'MatPaz EdTech',
      'duration': '6h 30min',
      'rating': 4.8,
      'students': 1234,
      'category': 'Desenvolvimento',
    },
    {
      'id': 2,
      'title': 'React Avançado',
      'description': 'Hooks, Context API, Redux e Next.js',
      'instructor': 'Cravo em Vídeo',
      'duration': '8h 15min',
      'rating': 4.9,
      'students': 856,
      'category': 'Frontend',
    },
    {
      'id': 3,
      'title': 'Node.js API REST',
      'description': 'Construa APIs robustas com Node e Express',
      'instructor': 'DevDojo',
      'duration': '10h 30min',
      'rating': 4.7,
      'students': 2341,
      'category': 'Backend',
    },
    {
      'id': 4,
      'title': 'TypeScript Completo',
      'description': 'TypeScript do zero ao avançado',
      'instructor': 'Código',
      'duration': '7h 45min',
      'rating': 4.9,
      'students': 945,
      'category': 'Desenvolvimento',
    },
    {
      'id': 5,
      'title': 'Figma UI/UX Design',
      'description': 'Aprenda design de interfaces do zero',
      'instructor': 'Interatividade Acelerada',
      'duration': '5h 20min',
      'rating': 4.6,
      'students': 1567,
      'category': 'Design',
    },
    {
      'id': 6,
      'title': 'Python para Data Science',
      'description': 'Análise de dados com Python, Pandas e NumPy',
      'instructor': 'Data Masters',
      'duration': '12h 10min',
      'rating': 4.8,
      'students': 3421,
      'category': 'Programação',
    },
  ];

  List<Map<String, dynamic>> get filteredCourses {
    return allCourses.where((course) {
      final matchesSearch = (course['title'] as String).toLowerCase().contains(_searchController.text.toLowerCase()) ||
          (course['description'] as String).toLowerCase().contains(_searchController.text.toLowerCase());
      final matchesCategory = selectedCategory == null || 
          selectedCategory == 'Todos' || 
          course['category'] == selectedCategory;
      return matchesSearch && matchesCategory;
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
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [Color(0xFF18181B), Colors.black],
              ),
            ),
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Back Button
                GestureDetector(
                  onTap: () => widget.onNavigate(Screen.home),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.arrow_back,
                        color: Color(0xFF9CA3AF),
                        size: 20,
                      ),
                      SizedBox(width: 8),
                      Text(
                        'Voltar',
                        style: TextStyle(
                          color: Color(0xFF9CA3AF),
                          fontSize: 16,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),

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
                  'Todos os Cursos',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Explore nossa biblioteca completa',
                  style: TextStyle(
                    color: Color(0xFF9CA3AF),
                    fontSize: 16,
                  ),
                ),
                const SizedBox(height: 24),

                // Search
                TextField(
                  controller: _searchController,
                  onChanged: (value) => setState(() {}),
                  decoration: InputDecoration(
                    hintText: 'Buscar cursos...',
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

          // Categories
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              border: Border(
                bottom: BorderSide(color: Color(0xFF27272A), width: 1),
              ),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  const Icon(Icons.filter_list, color: Color(0xFF9CA3AF), size: 16),
                  const SizedBox(width: 8),
                  ...categories.map((category) => _buildCategoryChip(category)),
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
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF18181B),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF27272A)),
                  ),
                  child: Row(
                    children: [
                      // Thumbnail
                      Container(
                        width: 128,
                        height: 96,
                        decoration: BoxDecoration(
                          color: const Color(0xFF27272A),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.play_circle_outline,
                            color: Color(0xFFFACC15),
                            size: 32,
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),

                      // Info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              course['title'] as String,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 16,
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
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                const Icon(Icons.star, color: Color(0xFFFACC15), size: 12),
                                const SizedBox(width: 4),
                                Text(
                                  '${course['rating']}',
                                  style: const TextStyle(
                                    color: Color(0xFF6B7280),
                                    fontSize: 12,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                const Icon(Icons.access_time, color: Color(0xFF6B7280), size: 12),
                                const SizedBox(width: 4),
                                Text(
                                  course['duration'] as String,
                                  style: const TextStyle(
                                    color: Color(0xFF6B7280),
                                    fontSize: 12,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Text(
                                  '${course['students']} alunos',
                                  style: const TextStyle(
                                    color: Color(0xFF6B7280),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFACC15).withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(4),
                                    border: Border.all(
                                      color: const Color(0xFFFACC15).withOpacity(0.2),
                                    ),
                                  ),
                                  child: Text(
                                    course['category'] as String,
                                    style: const TextStyle(
                                      color: Color(0xFFFACC15),
                                      fontSize: 10,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFFACC15),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: const Text(
                                    'Iniciar',
                                    style: TextStyle(
                                      color: Colors.black,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
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

  Widget _buildCategoryChip(String category) {
    final isSelected = selectedCategory == category || (selectedCategory == null && category == 'Todos');
    return Container(
      margin: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: () => setState(() => selectedCategory = category == 'Todos' ? null : category),
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
            category,
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