import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/login_screen.dart';
import 'screens/register_screen.dart';
import 'screens/home_screen.dart';
import 'screens/courses_screen.dart';
import 'screens/all_courses_screen.dart';
import 'screens/notifications_screen.dart';
import 'screens/profile_screen.dart';
import 'screens/progress_screen.dart';
import 'widgets/bottom_nav.dart';
import 'providers/user_provider.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => UserProvider(),
      child: MaterialApp(
        title: 'Learnly',
        theme: ThemeData(
          brightness: Brightness.dark,
          scaffoldBackgroundColor: const Color(0xFF0A0A0A),
          primaryColor: const Color(0xFFFACC15),
          fontFamily: 'Inter',
        ),
        home: const AppWrapper(),
        debugShowCheckedModeBanner: false,
      ),
    );
  }
}

enum Screen { login, register, home, courses, allCourses, notifications, profile, progress }

class AppWrapper extends StatefulWidget {
  const AppWrapper({super.key});

  @override
  State<AppWrapper> createState() => _AppWrapperState();
}

class _AppWrapperState extends State<AppWrapper> {
  Screen currentScreen = Screen.login;

  void handleLogin() {
    setState(() {
      currentScreen = Screen.home;
    });
  }

  void handleRegister() {
    setState(() {
      currentScreen = Screen.home;
    });
  }

  void handleLogout() {
    setState(() {
      currentScreen = Screen.login;
    });
  }

  void handleNavigate(Screen screen) {
    setState(() {
      currentScreen = screen;
    });
  }

  Widget _buildCurrentScreen() {
    switch (currentScreen) {
      case Screen.login:
        return LoginScreen(
          onLogin: handleLogin,
          onNavigateToRegister: () => handleNavigate(Screen.register),
        );
      case Screen.register:
        return RegisterScreen(
          onRegister: handleRegister,
          onNavigateToLogin: () => handleNavigate(Screen.login),
        );
      case Screen.home:
        return HomeScreen(
          onLogout: handleLogout,
          onNavigate: handleNavigate,
        );
      case Screen.courses:
        return CoursesScreen(onNavigate: handleNavigate);
      case Screen.allCourses:
        return AllCoursesScreen(onNavigate: handleNavigate);
      case Screen.notifications:
        return const NotificationsScreen();
      case Screen.profile:
        return ProfileScreen(
          onLogout: handleLogout,
          onNavigate: handleNavigate,
        );
      case Screen.progress:
        return ProgressScreen(onNavigate: handleNavigate);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<UserProvider>(
      builder: (context, userProvider, child) {
        final isLoggedIn = userProvider.isLoggedIn;
        
        return Scaffold(
          backgroundColor: const Color(0xFF0F0F0F),
          body: Center(
            child: Container(
              width: 428,
              height: 926,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF27272A), Color(0xFF18181B)],
                ),
                borderRadius: BorderRadius.circular(60),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.5),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(48),
                  ),
                  child: Stack(
                    children: [
                      Positioned(
                        top: 0,
                        left: 0,
                        right: 0,
                        child: Center(
                          child: Container(
                            width: 160,
                            height: 28,
                            decoration: const BoxDecoration(
                              color: Colors.black,
                              borderRadius: BorderRadius.only(
                                bottomLeft: Radius.circular(24),
                                bottomRight: Radius.circular(24),
                              ),
                            ),
                          ),
                        ),
                      ),
                      Positioned.fill(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(48),
                          child: Stack(
                            children: [
                              Positioned.fill(
                                bottom: isLoggedIn ? 80 : 0,
                                child: _buildCurrentScreen(),
                              ),
                              if (isLoggedIn)
                                Positioned(
                                  bottom: 0,
                                  left: 0,
                                  right: 0,
                                  child: BottomNav(
                                    currentScreen: currentScreen,
                                    onNavigate: handleNavigate,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}