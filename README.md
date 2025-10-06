# SOLID Principles with TypeScript and React

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" />
</div>

## 📚 About This Repository

This repository demonstrates the **SOLID principles** of object-oriented design using TypeScript and React. Each principle is explained with practical examples, showing both violations and proper implementations.

## 🎯 What are SOLID Principles?

SOLID is an acronym for five design principles that help developers create more maintainable, flexible, and scalable software:

1. **S** - [Single Responsibility Principle (SRP)](./src/principles/1-single-responsibility)
2. **O** - [Open/Closed Principle (OCP)](./src/principles/2-open-closed)
3. **L** - [Liskov Substitution Principle (LSP)](./src/principles/3-liskov-substitution)
4. **I** - [Interface Segregation Principle (ISP)](./src/principles/4-interface-segregation)
5. **D** - [Dependency Inversion Principle (DIP)](./src/principles/5-dependency-inversion)

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Basic knowledge of TypeScript and React

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/solid-principles-typescript.git

# Navigate to the project directory
cd solid-principles-typescript

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📂 Project Structure

```
solid-principles-typescript/
├── src/
│   ├── principles/
│   │   ├── 1-single-responsibility/
│   │   ├── 2-open-closed/
│   │   ├── 3-liskov-substitution/
│   │   ├── 4-interface-segregation/
│   │   └── 5-dependency-inversion/
│   ├── components/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🎓 Learning Path

Each principle folder contains:
- **README.md**: Detailed explanation of the principle
- **bad-example/**: Code that violates the principle
- **good-example/**: Properly refactored code following the principle
- **exercise/**: Practice problems to reinforce learning

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Robert C. Martin (Uncle Bob) for formulating the SOLID principles
- The TypeScript and React communities for excellent documentation
- All contributors who help improve this educational resource

## 📚 Additional Resources

- [Clean Code by Robert C. Martin](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Refactoring Guru - SOLID](https://refactoring.guru/design-patterns/solid-principles)

---

<div align="center">
  Made with ❤️ for the developer community
</div>
