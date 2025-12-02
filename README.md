# Distill

Export your source code to LLM-optimized Markdown in seconds. Perfect for sharing project context with ChatGPT, Claude, and other AI assistants.

![VS Code Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/marcozito.distill)
![VS Code Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/marcozito.distill)
![License](https://img.shields.io/github/license/mvss01/distill)

## Features

**Distill** transforms your codebase into a single, well-structured Markdown file that AI models can easily understand. It automatically generates:

- 📂 **Project structure tree** - Visual representation of your file hierarchy
- 📄 **Complete source code** - All files with syntax highlighting and metadata
- 🏷️ **Smart metadata** - File size, language detection, and modification dates
- ⚙️ **Flexible filtering** - GLOB-based configuration to include/exclude files

### Why Distill?

When working with AI assistants, providing comprehensive project context is crucial. Distill solves this by:

- Exporting entire codebases in a format optimized for LLM token limits
- Maintaining code structure and relationships between files
- Excluding irrelevant files (node_modules, build artifacts) automatically
- Supporting custom filters through a simple configuration file

## Installation

1. Open VS Code
2. Press `Ctrl+P` / `Cmd+P`
3. Type `ext install marcozito.distill`
4. Press Enter

Or install directly from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=marcozito.distill).

## Usage

### Quick Start

1. Open your project in VS Code
2. Press `Ctrl+Shift+P` / `Cmd+Shift+P`
3. Type **"distill: Export to Markdown"**
4. Your `ai-context.md` file will be generated at the project root

### Available Commands

| Command                       | Description                                            |
| ----------------------------- | ------------------------------------------------------ |
| `distill: Export to Markdown` | Generate a new Markdown file with your project context |
| `distill: Refresh Markdown`   | Update the existing Markdown file with latest changes  |
| `distill: Configure Files`    | Open/create the `.aicontext` configuration file        |

### Configuration File

Create a `.aicontext` file in your project root to customize which files to include or exclude:

```
# Distill Configuration (GLOB syntax)
# Lines without "!" = INCLUDE
# Lines with "!" = EXCLUDE

# Include TypeScript/JavaScript files
src/**/*.ts
src/**/*.tsx
src/**/*.js
package.json

# Exclude build outputs
!dist/**
!out/**

# Exclude tests
!**/*.test.ts
!**/*.spec.ts
```

### Settings

Configure Distill through VS Code settings (`Ctrl+,` / `Cmd+,`):

| Setting                      | Type    | Default         | Description                                      |
| ---------------------------- | ------- | --------------- | ------------------------------------------------ |
| `aicontext.outputFileName`   | string  | `ai-context.md` | Name of the generated Markdown file              |
| `aicontext.respectGitignore` | boolean | `true`          | Automatically exclude files listed in .gitignore |
| `aicontext.maxFileSize`      | number  | `1048576` (1MB) | Maximum file size to include (in bytes)          |

## Output Format

Distill generates a structured Markdown file with:

````markdown
# Project Context: your-project

**Generated:** 2025-12-02T03:00:00.000Z
**Total Files:** 15
**Total Size:** 45.2 KB

## Project Structure

src
├── commands
│ ├── exportCommand.ts
│ └── configureCommand.ts
├── core
│ ├── fileCollector.ts
│ └── markdownGenerator.ts
└── extension.ts
package.json

## Files

### src/extension.ts

**Language:** typescript
**Size:** 923 Bytes
**Last Modified:** 2025-12-02T02:49:45.050Z

```typescript
import * as vscode from 'vscode';
// ... full file content
```
````

## How It Works

1. **Configuration Parsing** - Reads `.aicontext` file and VS Code settings
2. **File Collection** - Scans workspace using GLOB patterns and filters
3. **Smart Filtering** - Excludes binaries, large files, and respects .gitignore
4. **Markdown Generation** - Creates structured output with syntax highlighting
5. **Progress Tracking** - Shows real-time progress during export

## Use Cases

- 🤖 **AI Pair Programming** - Share full project context with ChatGPT/Claude
- 📚 **Code Reviews** - Generate comprehensive snapshots for review
- 📖 **Documentation** - Create up-to-date code references
- 🔄 **Onboarding** - Help new developers understand project structure
- 💾 **Archiving** - Preserve project state in readable format

## Automatic Exclusions

Distill automatically excludes:

- `node_modules/` (always)
- Hidden files starting with `.` (always)
- `package-lock.json` (always)
- Files listed in `.gitignore` (configurable)
- Binary files (detected automatically)
- Files exceeding size limit (configurable)

## Requirements

- VS Code 1.85.0 or higher

## Known Issues

No known issues. Report bugs on [GitHub Issues](https://github.com/mvss01/distill/issues).

## Contributing

Contributions are welcome! Visit the [GitHub repository](https://github.com/mvss01/distill).

## License

MIT License - see [LICENSE](LICENSE.md) file for details.

## Release Notes

### 1.0.2

Initial release featuring:

- Export project to LLM-optimized Markdown
- GLOB-based file filtering
- .gitignore integration
- Smart binary detection
- Configurable file size limits
- Progress notifications

---

**Enjoy using Distill!** 🚀

If you find this extension helpful, please consider leaving a ⭐ review on the [marketplace](https://marketplace.visualstudio.com/items?itemName=marcozito.distill).

For questions or support, visit the [GitHub repository](https://github.com/mvss01/distill).
