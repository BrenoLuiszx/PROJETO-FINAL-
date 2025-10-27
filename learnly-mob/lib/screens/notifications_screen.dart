import 'package:flutter/material.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final notifications = [
      {
        'id': 1,
        'type': 'course',
        'icon': Icons.book,
        'title': 'Novo curso disponível',
        'message': 'Docker Essenciais já está disponível na plataforma',
        'time': '2 horas atrás',
        'unread': true,
        'color': Colors.blue,
      },
      {
        'id': 2,
        'type': 'achievement',
        'icon': Icons.emoji_events,
        'title': 'Conquista desbloqueada!',
        'message': 'Você completou 10 cursos. Parabéns!',
        'time': '5 horas atrás',
        'unread': true,
        'color': const Color(0xFFFACC15),
      },
      {
        'id': 3,
        'type': 'update',
        'icon': Icons.star,
        'title': 'Curso atualizado',
        'message': 'JavaScript Completo recebeu novos módulos',
        'time': '1 dia atrás',
        'unread': false,
        'color': Colors.purple,
      },
      {
        'id': 4,
        'type': 'progress',
        'icon': Icons.trending_up,
        'title': 'Progresso semanal',
        'message': 'Você estudou 12 horas esta semana. Continue assim!',
        'time': '2 dias atrás',
        'unread': false,
        'color': Colors.green,
      },
      {
        'id': 5,
        'type': 'course',
        'icon': Icons.book,
        'title': 'Lembrete de curso',
        'message': 'Continue seu progresso em React Fundamentos',
        'time': '3 dias atrás',
        'unread': false,
        'color': Colors.blue,
      },
      {
        'id': 6,
        'type': 'achievement',
        'icon': Icons.emoji_events,
        'title': 'Nova conquista',
        'message': 'Primeira semana completa de estudos!',
        'time': '1 semana atrás',
        'unread': false,
        'color': const Color(0xFFFACC15),
      },
    ];

    final unreadCount = notifications.where((n) => n['unread'] as bool).length;

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

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Notificações',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 4),
                        Text(
                          'Fique por dentro de tudo',
                          style: TextStyle(
                            color: Color(0xFF9CA3AF),
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFACC15),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        '$unreadCount novas',
                        style: const TextStyle(
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

          // Notifications List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: notifications.length,
              itemBuilder: (context, index) {
                final notification = notifications[index];
                final isUnread = notification['unread'] as bool;
                
                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: isUnread ? const Color(0xFF18181B) : const Color(0xFF18181B).withOpacity(0.5),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: const Color(0xFF27272A)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 40,
                        height: 40,
                        decoration: BoxDecoration(
                          color: (notification['color'] as Color).withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(
                          notification['icon'] as IconData,
                          color: notification['color'] as Color,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Text(
                                    notification['title'] as String,
                                    style: TextStyle(
                                      color: isUnread ? Colors.white : const Color(0xFF9CA3AF),
                                      fontSize: 16,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                ),
                                if (isUnread)
                                  Container(
                                    width: 8,
                                    height: 8,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFFACC15),
                                      shape: BoxShape.circle,
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 4),
                            Text(
                              notification['message'] as String,
                              style: const TextStyle(
                                color: Color(0xFF9CA3AF),
                                fontSize: 14,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              notification['time'] as String,
                              style: const TextStyle(
                                color: Color(0xFF6B7280),
                                fontSize: 12,
                              ),
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
}