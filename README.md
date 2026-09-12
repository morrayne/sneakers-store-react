# Sneakers Store

Pet-проект магазина кроссовок. Без реальной оплаты — только для портфолио.

## Стек

- React + TypeScript + Vite
- Tailwind CSS v4
- React Router
- Zustand (корзина, тема)
- Supabase (товары, заказы, auth)

## Запуск

1. Клонируй репозиторий
2. `npm install`
3. Скопируй `.env.example` → `.env.local` и заполни значения из Supabase
4. `npm run dev`

## Переменные окружения

- `VITE_SUPABASE_URL` — URL проекта Supabase
- `VITE_SUPABASE_ANON_KEY` — публичный anon-ключ Supabase
