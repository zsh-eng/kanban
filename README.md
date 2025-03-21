# Markdown Kanban

A local-first Kanban board application that uses markdown files as its data source.

## Installation

1. Install dependencies:

  ```bash
  pnpm install
  ```

2. Run the development server:

  ```bash
  pnpm tauri dev
  ```

3. Build for production:

  ```bash
  pnpm tauri build
  ```

## Usage

### Markdown Format

```markdown
# Board Title

## Column 1
- [ ] Task 1
- [x] Completed task
- [ ] Task with [[link]]

## Column 2
- [ ] Another task
```

## License

MIT
