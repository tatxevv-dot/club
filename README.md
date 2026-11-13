# FootballStats

Полноценный стартовый каркас футбольной аналитической платформы.

## Стек
- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL
- Framer Motion
- GitHub Actions для синхронизации

## Запуск
1. Создай проект в Supabase.
2. Выполни `supabase/migrations/0001_init.sql` в SQL Editor.
3. Создай `.env.local`:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
4. `npm install`
5. `npm run dev`

## Импорт данных
Скрипт `scripts/import-statsbomb.mjs` загружает открытые данные StatsBomb: лиги, сезоны, команды, игроков, матчи и составы.

Для GitHub Actions добавь секреты:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Workflow `.github/workflows/sync.yml` запускается ежедневно в 03:00 UTC и вручную через Run workflow.

## Что уже есть
- Полная реляционная схема под event data, xG, shotmaps, passing, defense, 360.
- Страницы: главная, лиги, команды, игроки, матчи.
- Профили игрока, команды, матча, лиги.
- Скелетоны, анимации, адаптив, минималистичный тёмный UI.
- Готовая база под StatsBomb Open Data, Understat и football-data.org.
