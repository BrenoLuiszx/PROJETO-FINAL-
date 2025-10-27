import 'package:flutter/material.dart';
import '../main.dart';

class BottomNav extends StatelessWidget {
  final Screen currentScreen;
  final Function(Screen) onNavigate;

  const BottomNav({
    super.key,
    required this.currentScreen,
    required this.onNavigate,
  });

  @override
  Widget build(BuildContext context) {
    final navItems = [
      {'id': Screen.home, 'label': 'Início', 'icon': Icons.home},
      {'id': Screen.courses, 'label': 'Cursos', 'icon': Icons.book},
      {'id': Screen.notifications, 'label': 'Notificações', 'icon': Icons.notifications},
      {'id': Screen.profile, 'label': 'Perfil', 'icon': Icons.person},
    ];

    return Container(
      height: 80,
      decoration: const BoxDecoration(
        color: Color(0xFF18181B),
        border: Border(
          top: BorderSide(color: Color(0xFF27272A), width: 1),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: navItems.map((item) {
          final isActive = currentScreen == item['id'];
          return GestureDetector(
            onTap: () => onNavigate(item['id'] as Screen),
            child: Container(
              padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 12),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    item['icon'] as IconData,
                    color: isActive ? const Color(0xFFFACC15) : const Color(0xFF9CA3AF),
                    size: 20,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    item['label'] as String,
                    style: TextStyle(
                      color: isActive ? const Color(0xFFFACC15) : const Color(0xFF9CA3AF),
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}