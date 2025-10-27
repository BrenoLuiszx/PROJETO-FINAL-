import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../main.dart';
import '../providers/user_provider.dart';

class ProfileScreen extends StatefulWidget {
  final VoidCallback onLogout;
  final Function(Screen) onNavigate;

  const ProfileScreen({
    super.key,
    required this.onLogout,
    required this.onNavigate,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  void _showEditPhotoDialog() {
    final TextEditingController urlController = TextEditingController();
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: Color(0xFF18181B),
        title: Text(
          'Editar Foto do Perfil',
          style: TextStyle(color: Colors.white),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: urlController,
              style: TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Cole a URL da imagem aqui',
                hintStyle: TextStyle(color: Color(0xFF6B7280)),
                filled: true,
                fillColor: Color(0xFF27272A),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(color: Color(0xFF374151)),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(color: Color(0xFF374151)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: BorderSide(color: Color(0xFFFACC15)),
                ),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancelar', style: TextStyle(color: Color(0xFF9CA3AF))),
          ),
          ElevatedButton(
            onPressed: () async {
              if (urlController.text.isNotEmpty) {
                try {
                  await userProvider.updateUserPhoto(urlController.text);
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Foto atualizada com sucesso!')),
                  );
                } catch (e) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Erro ao atualizar foto: $e')),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Color(0xFFFACC15),
              foregroundColor: Colors.black,
            ),
            child: Text('Salvar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final stats = [
      {
        'label': 'Cursos Concluídos',
        'value': 0,
        'total': 20,
        'icon': Icons.emoji_events,
        'color': const Color(0xFFFACC15),
        'percentage': 0,
      },
      {
        'label': 'Horas de Estudo',
        'value': 0,
        'total': 100,
        'icon': Icons.access_time,
        'color': Colors.blue,
        'percentage': 0,
      },
      {
        'label': 'Sequência',
        'value': 0,
        'total': 30,
        'icon': Icons.flash_on,
        'color': Colors.purple,
        'percentage': 0,
      },
    ];

    final achievements = [
      {
        'name': 'Primeira Jornada',
        'description': 'Complete seu primeiro curso',
        'icon': Icons.emoji_events,
        'unlocked': false,
        'progress': 0,
        'color': const Color(0xFF6B7280),
      },
      {
        'name': 'Maratonista',
        'description': 'Estude 7 dias seguidos',
        'icon': Icons.flash_on,
        'unlocked': false,
        'progress': 0,
        'color': const Color(0xFF6B7280),
      },
      {
        'name': 'Mestre do Código',
        'description': 'Complete 10 cursos',
        'icon': Icons.school,
        'unlocked': false,
        'progress': 0,
        'color': const Color(0xFF6B7280),
      },
      {
        'name': 'Dedicação Total',
        'description': 'Estude 100 horas',
        'icon': Icons.trending_up,
        'unlocked': false,
        'progress': 0,
        'color': const Color(0xFF6B7280),
      },
    ];

    final recentActivity = [
      {
        'type': 'welcome',
        'title': 'Bem-vindo ao Learnly!',
        'time': 'Agora',
        'icon': Icons.celebration,
        'color': const Color(0xFFFACC15),
      },
    ];

    final menuItems = [
      {
        'label': 'Editar Perfil',
        'icon': Icons.edit,
        'subtitle': 'Atualize suas informações',
        'danger': false,
      },
      {
        'label': 'Configurações',
        'icon': Icons.settings,
        'subtitle': 'Preferências do app',
        'danger': false,
      },
      {
        'label': 'Sair',
        'icon': Icons.logout,
        'subtitle': 'Desconectar da conta',
        'danger': true,
      },
    ];

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

                // Profile Card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        const Color(0xFF27272A).withOpacity(0.5),
                        const Color(0xFF18181B).withOpacity(0.5),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(
                      color: const Color(0xFF374151).withOpacity(0.5),
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Stack(
                            children: [
                              Consumer<UserProvider>(
                                builder: (context, userProvider, child) {
                                  final user = userProvider.user;
                                  String initials = 'ES';
                                  if (user?.nome != null && user!.nome.isNotEmpty) {
                                    final names = user.nome.split(' ');
                                    initials = names.length >= 2 
                                        ? '${names[0][0]}${names[1][0]}'
                                        : names[0].substring(0, names[0].length >= 2 ? 2 : 1);
                                  }
                                  
                                  final hasPhoto = user?.foto != null && user!.foto!.isNotEmpty;
                                  return Container(
                                    width: 80,
                                    height: 80,
                                    decoration: BoxDecoration(
                                      shape: BoxShape.circle,
                                      color: Color(0xFFFACC15),
                                      image: hasPhoto
                                          ? DecorationImage(
                                              image: NetworkImage(user!.foto!),
                                              fit: BoxFit.cover,
                                            )
                                          : null,
                                    ),
                                    child: !hasPhoto
                                        ? Center(
                                            child: Text(
                                              initials.toUpperCase(),
                                              style: TextStyle(
                                                color: Colors.black,
                                                fontSize: 24,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          )
                                        : null,
                                  );
                                },
                              ),
                              Positioned(
                                bottom: 0,
                                right: 0,
                                child: GestureDetector(
                                  onTap: _showEditPhotoDialog,
                                  child: Container(
                                    width: 28,
                                    height: 28,
                                    decoration: const BoxDecoration(
                                      color: Color(0xFFFACC15),
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(
                                      Icons.camera_alt,
                                      color: Colors.black,
                                      size: 16,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Consumer<UserProvider>(
                                      builder: (context, userProvider, child) {
                                        final user = userProvider.user;
                                        return Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              user?.nome ?? 'Estudante',
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 18,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                            SizedBox(height: 4),
                                            Row(
                                              children: [
                                                Icon(
                                                  Icons.email,
                                                  color: Color(0xFF9CA3AF),
                                                  size: 12,
                                                ),
                                                SizedBox(width: 4),
                                                Text(
                                                  user?.email ?? 'estudante@learnly.com',
                                                  style: TextStyle(
                                                    color: Color(0xFF9CA3AF),
                                                    fontSize: 14,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ],
                                        );
                                      },
                                    ),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF374151),
                                        borderRadius: BorderRadius.circular(4),
                                        border: Border.all(color: const Color(0xFF374151)),
                                      ),
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            Icons.edit,
                                            color: Color(0xFF9CA3AF),
                                            size: 12,
                                          ),
                                          SizedBox(width: 4),
                                          Text(
                                            'Editar',
                                            style: TextStyle(
                                              color: Color(0xFF9CA3AF),
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Row(
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
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(
                                            Icons.workspace_premium,
                                            color: Color(0xFFFACC15),
                                            size: 12,
                                          ),
                                          SizedBox(width: 4),
                                          Text(
                                            'Premium',
                                            style: TextStyle(
                                              color: Color(0xFFFACC15),
                                              fontSize: 10,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(
                                        color: Colors.blue.withOpacity(0.1),
                                        borderRadius: BorderRadius.circular(4),
                                        border: Border.all(
                                          color: Colors.blue.withOpacity(0.2),
                                        ),
                                      ),
                                      child: const Text(
                                        'Nível 12',
                                        style: TextStyle(
                                          color: Colors.blue,
                                          fontSize: 10,
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
                      const SizedBox(height: 16),
                      Container(
                        padding: const EdgeInsets.only(top: 16),
                        decoration: const BoxDecoration(
                          border: Border(
                            top: BorderSide(
                              color: Color(0xFF374151),
                              width: 0.5,
                            ),
                          ),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                            Column(
                              children: [
                                Text(
                                  '0',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  'Cursos',
                                  style: TextStyle(
                                    color: Color(0xFF6B7280),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            Column(
                              children: [
                                Text(
                                  '0h',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  'Estudadas',
                                  style: TextStyle(
                                    color: Color(0xFF6B7280),
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                            Column(
                              children: [
                                Text(
                                  '0',
                                  style: TextStyle(
                                    color: Colors.white,
                                    fontSize: 18,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                                Text(
                                  'Dia seguido',
                                  style: TextStyle(
                                    color: Color(0xFF6B7280),
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
              ],
            ),
          ),

          // Tabs
          Expanded(
            child: Column(
              children: [
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 24),
                  decoration: BoxDecoration(
                    color: const Color(0xFF18181B),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: const Color(0xFF27272A)),
                  ),
                  child: TabBar(
                    controller: _tabController,
                    indicator: BoxDecoration(
                      color: const Color(0xFFFACC15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    labelColor: Colors.black,
                    unselectedLabelColor: const Color(0xFF9CA3AF),
                    labelStyle: const TextStyle(fontWeight: FontWeight.w600),
                    tabs: const [
                      Tab(text: 'Estatísticas'),
                      Tab(text: 'Conquistas'),
                      Tab(text: 'Atividade'),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                Expanded(
                  child: TabBarView(
                    controller: _tabController,
                    children: [
                      // Stats Tab
                      ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        itemCount: stats.length,
                        itemBuilder: (context, index) {
                          final stat = stats[index];
                          return Container(
                            margin: const EdgeInsets.only(bottom: 16),
                            padding: const EdgeInsets.all(20),
                            decoration: BoxDecoration(
                              color: const Color(0xFF18181B),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF27272A)),
                            ),
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    Container(
                                      width: 48,
                                      height: 48,
                                      decoration: BoxDecoration(
                                        gradient: LinearGradient(
                                          colors: [
                                            (stat['color'] as Color).withOpacity(0.8),
                                            stat['color'] as Color,
                                          ],
                                        ),
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                      child: Icon(
                                        stat['icon'] as IconData,
                                        color: Colors.white,
                                        size: 24,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            stat['label'] as String,
                                            style: const TextStyle(
                                              color: Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          Text(
                                            '${stat['value']} de ${stat['total']}',
                                            style: const TextStyle(
                                              color: Color(0xFF9CA3AF),
                                              fontSize: 14,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Text(
                                      '${stat['percentage']}%',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 16),
                                LinearProgressIndicator(
                                  value: (stat['percentage'] as int) / 100,
                                  backgroundColor: const Color(0xFF27272A),
                                  valueColor: AlwaysStoppedAnimation<Color>(stat['color'] as Color),
                                  minHeight: 8,
                                ),
                              ],
                            ),
                          );
                        },
                      ),

                      // Achievements Tab
                      ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        itemCount: achievements.length,
                        itemBuilder: (context, index) {
                          final achievement = achievements[index];
                          final isUnlocked = achievement['unlocked'] as bool;
                          
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: isUnlocked 
                                  ? (achievement['color'] as Color).withOpacity(0.1)
                                  : const Color(0xFF18181B),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isUnlocked 
                                    ? (achievement['color'] as Color).withOpacity(0.2)
                                    : const Color(0xFF27272A),
                              ),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: isUnlocked 
                                        ? (achievement['color'] as Color).withOpacity(0.1)
                                        : const Color(0xFF27272A),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isUnlocked 
                                          ? (achievement['color'] as Color).withOpacity(0.2)
                                          : const Color(0xFF374151),
                                    ),
                                  ),
                                  child: Icon(
                                    achievement['icon'] as IconData,
                                    color: achievement['color'] as Color,
                                    size: 24,
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
                                              achievement['name'] as String,
                                              style: TextStyle(
                                                color: isUnlocked ? Colors.white : const Color(0xFF6B7280),
                                                fontSize: 16,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ),
                                          if (isUnlocked)
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
                                                'Desbloqueado',
                                                style: TextStyle(
                                                  color: Colors.green,
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ),
                                        ],
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        achievement['description'] as String,
                                        style: const TextStyle(
                                          color: Color(0xFF9CA3AF),
                                          fontSize: 14,
                                        ),
                                      ),
                                      if (!isUnlocked) ...[
                                        const SizedBox(height: 8),
                                        Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            const Text(
                                              'Progresso',
                                              style: TextStyle(
                                                color: Color(0xFF6B7280),
                                                fontSize: 12,
                                              ),
                                            ),
                                            Text(
                                              '${achievement['progress']}%',
                                              style: const TextStyle(
                                                color: Color(0xFF6B7280),
                                                fontSize: 12,
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 4),
                                        LinearProgressIndicator(
                                          value: (achievement['progress'] as int) / 100,
                                          backgroundColor: const Color(0xFF27272A),
                                          valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF6B7280)),
                                          minHeight: 6,
                                        ),
                                      ],
                                    ],
                                  ),
                                ),
                              ],
                            ),
                          );
                        },
                      ),

                      // Activity Tab
                      ListView.builder(
                        padding: const EdgeInsets.symmetric(horizontal: 24),
                        itemCount: recentActivity.length,
                        itemBuilder: (context, index) {
                          final activity = recentActivity[index];
                          
                          return Container(
                            margin: const EdgeInsets.only(bottom: 12),
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: const Color(0xFF18181B),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: const Color(0xFF27272A)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: const Color(0xFF27272A),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Icon(
                                    activity['icon'] as IconData,
                                    color: activity['color'] as Color,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        activity['title'] as String,
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
                                            Icons.calendar_today,
                                            color: Color(0xFF6B7280),
                                            size: 12,
                                          ),
                                          const SizedBox(width: 4),
                                          Text(
                                            activity['time'] as String,
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
                              ],
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
                
                // Settings Menu
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Configurações',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        decoration: BoxDecoration(
                          color: const Color(0xFF18181B),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFF27272A)),
                        ),
                        child: Column(
                          children: menuItems.asMap().entries.map((entry) {
                            final index = entry.key;
                            final item = entry.value;
                            final isDanger = item['danger'] as bool;
                            
                            return GestureDetector(
                              onTap: () {
                                if (isDanger) {
                                  Provider.of<UserProvider>(context, listen: false).logout();
                                  widget.onLogout();
                                }
                              },
                              child: Container(
                                padding: const EdgeInsets.all(16),
                                decoration: BoxDecoration(
                                  border: index < menuItems.length - 1
                                      ? const Border(
                                          bottom: BorderSide(
                                            color: Color(0xFF27272A),
                                            width: 1,
                                          ),
                                        )
                                      : null,
                                ),
                                child: Row(
                                  children: [
                                    Container(
                                      width: 40,
                                      height: 40,
                                      decoration: BoxDecoration(
                                        color: isDanger 
                                            ? Colors.red.withOpacity(0.1)
                                            : const Color(0xFF27272A),
                                        borderRadius: BorderRadius.circular(8),
                                      ),
                                      child: Icon(
                                        item['icon'] as IconData,
                                        color: isDanger ? Colors.red : const Color(0xFF9CA3AF),
                                        size: 20,
                                      ),
                                    ),
                                    const SizedBox(width: 16),
                                    Expanded(
                                      child: Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text(
                                            item['label'] as String,
                                            style: TextStyle(
                                              color: isDanger ? Colors.red : Colors.white,
                                              fontSize: 16,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                          Text(
                                            item['subtitle'] as String,
                                            style: const TextStyle(
                                              color: Color(0xFF6B7280),
                                              fontSize: 12,
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),
                                    Icon(
                                      Icons.chevron_right,
                                      color: isDanger ? Colors.red : const Color(0xFF6B7280),
                                      size: 20,
                                    ),
                                  ],
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}