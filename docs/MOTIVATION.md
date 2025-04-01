# Motivation

## Main idea

**Main idea**: "render" view for kanban is different from the "edit" view.

It should resolve 2 use cases: personal projects and todo lists.
All features should come out of this main functionality that I'm trying to solve.

### Personal projects

I should be able to drag and drop any markdown kanban file
(from all my individual GitHub repositories) into the app.

Reasons:

1. File over app
2. Continue to use the underlying git as version control
3. Principle of colocation - tasks for the project should remain with the project

### Todo lists

A single todo list is easier to navigate.
It's much easier to search using vim keybindings and type out the tasks there.

However, a kanban board is easier to *look at* and navigate.

### Bonus

Mobile view: something like Telegram.

I'm thinking each kanban "column" can just be a separate "chat"
for me to add tasks into.

Maybe LLMs for subcategorisation?

## Learning

- Gain a deeper understanding for building Obsidian replacement.
  - Build on top of CodeMirror.
  - Desktop apps
- Explore this idea of a separate view and edit model.
