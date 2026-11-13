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

## Что уже есть
- Полная реляционная схема под event data, xG, shotmaps, passing, defense, 360.
- Страницы: главная, лиги, команды, игроки, матчи.
- Профили игрока, команды, матча, лиги.
- Скелетоны, анимации, адаптив, минималистичный тёмный UI.
- Готовая база под StatsBomb Open Data, Understat и football-data.org.

## Дальше
- Скрипты импорта football-data.org.
- Скрипты импорта Understat.
- Импорт StatsBomb Open Data.
- Страницы сравнения игроков.
- Плеер трансляций позже.
