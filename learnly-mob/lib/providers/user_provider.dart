import 'package:flutter/material.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class UserProvider with ChangeNotifier {
  User? _user;
  bool _isLoggedIn = false;

  User? get user => _user;
  bool get isLoggedIn => _isLoggedIn;

  void login(User user) {
    _user = user;
    _isLoggedIn = true;
    notifyListeners();
  }

  void logout() {
    _user = null;
    _isLoggedIn = false;
    notifyListeners();
  }

  Future<void> updateUserPhoto(String photoUrl) async {
    if (_user != null) {
      try {
        final updatedUser = await ApiService.updateUserPhoto(_user!.id, photoUrl);
        _user = updatedUser;
        notifyListeners();
      } catch (e) {
        // Se falhar na API, atualiza localmente
        _user = User(
          id: _user!.id,
          nome: _user!.nome,
          email: _user!.email,
          foto: photoUrl,
          role: _user!.role,
        );
        notifyListeners();
      }
    }
  }
}