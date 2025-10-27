class User {
  final int id;
  final String nome;
  final String email;
  final String? foto;
  final String role;

  User({
    required this.id,
    required this.nome,
    required this.email,
    this.foto,
    required this.role,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? 0,
      nome: json['nome'] ?? '',
      email: json['email'] ?? '',
      foto: json['foto'],
      role: json['role'] ?? 'USER',
    );
  }
}