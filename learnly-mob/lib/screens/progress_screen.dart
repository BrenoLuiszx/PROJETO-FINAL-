import 'package:flutter/material.dart';
import '../main.dart';

class ProgressScreen extends StatelessWidget {
  final Function(Screen) onNavigate;

  const ProgressScreen({super.key, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final weeklyProgress = [
      {'day': 'Seg', 'minutes': 45, 'goal': 60},
      {'day': 'Ter', 'minutes': 60, 'goal': 60},
      {'day': 'Qua', 'minutes': 30, 'goal': 60},
      {'day': 'Qui', 'minutes': 75, 'goal': 60},
      {'day': 'Sex', 'minutes': 50, 'goal': 60},
      {'day': 'Sáb', 'minutes': 20, 'goal': 60},
      {'day': 'Dom', 'minutes': 0, 'goal': 60},
    ];

    final coursesInProgress = [
      {
        'name': 'JavaScript Completo',
        'progress': 65,
        'hoursSpent': 12,
        'totalHours': 18,
        'lastActivity': 'Hoje'
      },
      {
        'name': 'React Fundamentos',
        'progress': 30,
        'hoursSpent': 5,
        'totalHours': 16,
        'lastActivity': 'Ontem'
      },
      {
        'name': 'CSS Grid e Flexbox',
        'progress': 85,
        'hoursSpent': 8,
        'totalHours': 10,
        'lastActivity': '2 dias atrás'
      },
    ];

    final achievements = [
      {'title': 'Meta Semanal', 'value': '5/7 dias', 'percentage': 71, 'color': const Color(0xFFFACC15), 'icon': Icons.track_changes},
      {'title': 'Sequência Atual', 'value': '7 dias', 'percentage': 100, 'color': Colors.purple, 'icon': Icons.local_fire_department},
      {'title': 'Este Mês', 'value': '24h estudadas', 'percentage': 60, 'color': Colors.blue, 'icon': Icons.calendar_today},
    ];

    final maxMinutes = weeklyProgress.map((d) => d['minutes'] as int).reduce((a, b) => a > b ? a : b);

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
            padding: const EdgeInsets.fromLTRB(24, 24, 24, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Back Button
                GestureDetector(
                  onTap: () => onNavigate(Screen.home),
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
                  'Seu Progresso',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Acompanhe sua evolução',
                  style: TextStyle(
                    color: Color(0xFF9CA3AF),
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Overall Stats
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      children: achievements.map((achievement) {
                        return Expanded(
                          child: Container(
                            margin: const EdgeInsets.only(right: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFF18181B),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF27272A)),
                            ),
                            child: Column(
                              children: [
                                Container(
                                  width: 32,
                                  height: 32,
                                  decoration: BoxDecoration(
                                    color: (achievement['color'] as Color).withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    achievement['icon'] as IconData,
                                    color: achievement['color'] as Color,
                                    size: 16,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  achievement['value'] as String,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  achievement['title'] as String,
                                  style: const TextStyle(
                                    color: Color(0xFF6B7280),
                                    fontSize: 10,
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                                const SizedBox(height: 8),
                                LinearProgressIndicator(
                                  value: (achievement['percentage'] as int) / 100,
                                  backgroundColor: const Color(0xFF27272A),
                                  valueColor: AlwaysStoppedAnimation<Color>(achievement['color'] as Color),
                                  minHeight: 4,
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Weekly Chart
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Container(
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: const Color(0xFF18181B),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: const Color(0xFF27272A)),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text(
                                'Atividade Semanal',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: Colors.green.withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(4),
                                  border: Border.all(
                                    color: Colors.green.withOpacity(0.2),
                                  ),
                                ),
                                child: const Text(
                                  '260 min esta semana',
                                  style: TextStyle(
                                    color: Colors.green,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          
                          SizedBox(
                            height: 128,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: weeklyProgress.map((day) {
                                final minutes = day['minutes'] as int;
                                final goal = day['goal'] as int;
                                final height = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0.0;
                                final isGoalMet = minutes >= goal;
                                
                                return Expanded(
                                  child: Column(
                                    mainAxisAlignment: MainAxisAlignment.end,
                                    children: [
                                      Container(
                                        width: 20,
                                        height: height,
                                        margin: const EdgeInsets.symmetric(horizontal: 4),
                                        decoration: BoxDecoration(
                                          gradient: isGoalMet
                                              ? const LinearGradient(
                                                  begin: Alignment.bottomCenter,
                                                  end: Alignment.topCenter,
                                                  colors: [Color(0xFFFACC15), Color(0xFFF97316)],
                                                )
                                              : null,
                                          color: isGoalMet ? null : const Color(0xFF374151),
                                          borderRadius: const BorderRadius.only(
                                            topLeft: Radius.circular(4),
                                            topRight: Radius.circular(4),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        day['day'] as String,
                                        style: const TextStyle(
                                          color: Color(0xFF6B7280),
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                );
                              }).toList(),
                            ),
                          ),
                          
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.only(top: 12),
                            decoration: const BoxDecoration(
                              border: Border(
                                top: BorderSide(color: Color(0xFF27272A), width: 1),
                              ),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 12,
                                      height: 12,
                                      decoration: const BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [Color(0xFFFACC15), Color(0xFFF97316)],
                                        ),
                                        borderRadius: BorderRadius.all(Radius.circular(2)),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    const Text(
                                      'Meta atingida',
                                      style: TextStyle(
                                        color: Color(0xFF9CA3AF),
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(width: 16),
                                Row(
                                  children: [
                                    Container(
                                      width: 12,
                                      height: 12,
                                      decoration: const BoxDecoration(
                                        color: Color(0xFF374151),
                                        borderRadius: BorderRadius.all(Radius.circular(2)),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    const Text(
                                      'Abaixo da meta',
                                      style: TextStyle(
                                        color: Color(0xFF9CA3AF),
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Courses in Progress
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Cursos em Andamento',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 12),
                        ...coursesInProgress.map((course) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFF18181B),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF27272A)),
                            ),
                            child: Column(
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            course['name'] as String,
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          const SizedBox(height: 4),
                                          Row(
                                            children: [
                                              const Icon(
                                                Icons.access_time,
                                                color: Color(0xFF6B7280),
                                                size: 12,
                                              ),
                                              const SizedBox(width: 4),
                                              Text(
                                                '${course['hoursSpent']}h de ${course['totalHours']}h',
                                                style: const TextStyle(
                                                  color: Color(0xFF6B7280),
                                                  fontSize: 12,
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              const Text(
                                                '•',
                                                style: TextStyle(
                                                  color: Color(0xFF6B7280),
                                                  fontSize: 12,
                                                ),
                                              ),
                                              const SizedBox(width: 12),
                                              Text(
                                                course['lastActivity'] as String,
                                                style: const TextStyle(
                                                  color: Color(0xFF6B7280),
                                                  fontSize: 12,
                                                ),
                                              ),
                                            ],
                                          ),
                                        ],
                                      ),
                                    ),
                                    Text(
                                      '${course['progress']}%',
                                      style: const TextStyle(
                                        color: Color(0xFFFACC15),
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                LinearProgressIndicator(
                                  value: (course['progress'] as int) / 100,
                                  backgroundColor: const Color(0xFF27272A),
                                  valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFFACC15)),
                                  minHeight: 8,
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Summary Cards
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Row(
                      children: [
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.green.withOpacity(0.1),
                                  Colors.green.withOpacity(0.05),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: Colors.green.withOpacity(0.2),
                              ),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(
                                  Icons.emoji_events,
                                  color: Colors.green,
                                  size: 24,
                                ),
                                SizedBox(height: 8),
                                Text(
                                  '12 Cursos',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  'Concluídos',
                                  style: TextStyle(
                                    color: Color(0xFF9CA3AF),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: [
                                  Colors.orange.withOpacity(0.1),
                                  Colors.red.withOpacity(0.1),
                                ],
                              ),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: Colors.orange.withOpacity(0.2),
                              ),
                            ),
                            child: const Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(
                                  Icons.book,
                                  color: Colors.orange,
                                  size: 24,
                                ),
                                SizedBox(height: 8),
                                Text(
                                  '3 Cursos',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  'Em andamento',
                                  style: TextStyle(
                                    color: Color(0xFF9CA3AF),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}