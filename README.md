1. A collection of simple products, built free and open source software with no monetization whatsoever. Aiming to destroy the gdp of simple software.

## Kanban demo

This repository includes a minimal, unstyled Kanban implementation with the following data model:

- `users`
- `boards` (owned by users via `ownerUserId`)
- `lists` (contain `boardId` and grouped `taskIds`)
- `tasks` (contain `boardId`, `listId`, `name`, and `description`)

### Run

Open `/home/runner/work/libreware/libreware/index.html` in any browser.

### Features

- Render lists and tasks for a board
- Add lists to a board
- Add tasks with name + description into a selected list
- Move tasks between lists
