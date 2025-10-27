class Course {
  final int id;
  final String titulo;
  final String descricao;
  final String url;
  final String categoria;
  final String instrutor;
  final int duracao;

  Course({
    required this.id,
    required this.titulo,
    required this.descricao,
    required this.url,
    required this.categoria,
    required this.instrutor,
    required this.duracao,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'] ?? 0,
      titulo: json['titulo'] ?? '',
      descricao: json['descricao'] ?? '',
      url: json['url'] ?? '',
      categoria: json['categoria'] ?? '',
      instrutor: json['instrutor'] ?? '',
      duracao: json['duracao'] ?? 0,
    );
  }
}