# Contributing to Tripli

Thank you for your interest in contributing to Tripli! We welcome contributions from everyone. This document provides guidelines and instructions for contributing.

## 🎯 Code of Conduct

Please be respectful and constructive in all interactions with other contributors and maintainers.

## 🐛 Reporting Bugs

Before submitting a bug report:
1. Check existing [Issues](https://github.com/Meet807/tripli/issues) to avoid duplicates
2. Be specific and include:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

**Submit bug reports via GitHub Issues**

## 💡 Suggesting Features

Love an idea? Here's how to suggest it:
1. Check existing [Discussions](https://github.com/Meet807/tripli/discussions)
2. Describe the feature and why it would be useful
3. Provide examples if possible
4. Consider implementation approach

**Submit feature requests via GitHub Discussions or Issues**

## 🔧 Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/yourusername/tripli.git
cd tripli

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Start development server
npm run dev
```

## 📝 Making Changes

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Write clean, readable code**:
   - Follow existing code style
   - Use TypeScript for type safety
   - Add comments for complex logic
   - Keep functions focused and small

3. **Test your changes**:
   ```bash
   npm run build
   npm run dev
   ```

4. **Commit with clear messages**:
   ```bash
   git commit -m "feat: add new feature" 
   git commit -m "fix: resolve bug in component"
   git commit -m "docs: update README"
   ```

## 📤 Submitting a Pull Request

1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub with:
   - Clear title describing the change
   - Description of what changed and why
   - Reference to related issues if any
   - Screenshots for UI changes

3. **Respond to feedback**:
   - Be open to suggestions
   - Make requested changes promptly
   - Keep discussions respectful

## ✅ PR Review Checklist

Before submitting, ensure:
- [ ] Code follows project style guide
- [ ] All tests pass (`npm run build`)
- [ ] No console errors or warnings
- [ ] TypeScript compiles without errors
- [ ] Changes are well-documented
- [ ] Screenshots provided for UI changes
- [ ] No unrelated changes included

## 🎨 Code Style Guide

### TypeScript/React
```typescript
// ✅ Good - Clear naming, proper typing
interface Trip {
  destination: string;
  duration: number;
  budget: number;
}

const calculateTripCost = (trip: Trip): number => {
  return trip.budget * trip.duration;
};

// ❌ Bad - Unclear naming, missing types
const calc = (t: any) => {
  return t.b * t.d;
};
```

### File Organization
- Components in `components/` or `app/`
- Utilities in `lib/`
- Types in dedicated `.ts` files
- Tests next to source files

### Naming Conventions
- Components: PascalCase (e.g., `TripDetails.tsx`)
- Functions/variables: camelCase (e.g., `calculateCost()`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_GROUP_SIZE`)
- Private functions: prefix with `_` (e.g., `_formatDate()`)

## 🧪 Testing

While we don't have automated tests yet, please:
1. Test your changes manually
2. Test across different browsers
3. Test on mobile viewports
4. Verify API integrations work

## 📚 Documentation

Update documentation for:
- New features or changes
- New dependencies or configuration
- API endpoint changes
- Environment variable additions

## 🚀 Release Process

Maintainers will:
1. Review and merge PRs
2. Update version in `package.json`
3. Create GitHub release
4. Deploy to production via Vercel

## ❓ Questions?

- Check existing [Issues](https://github.com/Meet807/tripli/issues) and [Discussions](https://github.com/Meet807/tripli/discussions)
- Email: meetkothariii@gmail.com
- Create a Discussion for general questions

## 🎉 Thank You!

Your contributions help make Tripli better for everyone. We appreciate your effort and look forward to working with you!

---

**Happy Contributing! 🚀**