import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/course.dart';
import '../models/user.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8080/api';

  static Future<List<Course>> getCourses() async {
    final response = await http.get(Uri.parse('$baseUrl/cursos'));
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(response.body);
      return data.map((json) => Course.fromJson(json)).toList();
    }
    throw Exception('Erro ao carregar cursos');
  }

  static Future<User> login(String email, String senha) async {
    final response = await http.post(
      Uri.parse('$baseUrl/usuarios/login'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'email': email, 'senha': senha}),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return User.fromJson(data['usuario']);
    }
    throw Exception('Email ou senha incorretos');
  }

  static Future<User> register(String nome, String email, String senha, String? foto) async {
    final Map<String, dynamic> userData = {
      'nome': nome,
      'email': email,
      'senha': senha,
    };
    
    if (foto != null && foto.isNotEmpty) {
      userData['foto'] = foto;
    }
    
    final response = await http.post(
      Uri.parse('$baseUrl/usuarios/registrar'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode(userData),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return User.fromJson(data);
    }
    throw Exception('Erro no cadastro');
  }

  static Future<User> updateUserPhoto(int userId, String photoUrl) async {
    final response = await http.put(
      Uri.parse('$baseUrl/usuarios/$userId/foto'),
      headers: {'Content-Type': 'application/json'},
      body: json.encode({'foto': photoUrl}),
    );
    
    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return User.fromJson(data);
    }
    throw Exception('Erro ao atualizar foto');
  }
}