# Code2Context

Extensão VSCode que exporta código-fonte selecionado para Markdown otimizado para consumo de LLMs [][].

## Funcionalidades

- ✅ Exportação de código para Markdown estruturado
- ✅ Configuração via arquivo `.aicontext` (sintaxe .gitignore)
- ✅ Atualização automática do contexto
- ✅ Suporte a múltiplas linguagens
- ✅ Geração de árvore de diretórios
- ✅ Progress indicator para operações longas

## Instalação

```bash
npm install
npm run compile
npm install -g @vscode/vsce
vsce package
code --install-extension code2context-1.0.0.vsix
```
