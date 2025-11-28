// src/components/navbar/config/MenuConfig.js
import { to } from './linkBuilder';

// Лінк "Всі категорії" → просто /products
export const ALL_LINK = to({});

// Головні секції в мегаменю
export const MENU_SECTIONS = [
    /* ===================== Собакам ===================== */
    {
        key: 'dogs',
        icon: '🐶',
        label: 'Собакам',
        columns: [
            {
                title: 'Корм для собак',
                items: [
                    // весь корм для собак
                    { label: 'Весь корм для собак', to: to({ petType: 'DOG', kind: 'FEED' }) },

                    // підбренди
                    { label: 'Dasty Adult',  to: to({ petType: 'DOG', kind: 'FEED', brand: 'Dasty', q: 'adult' }) },
                    { label: 'Dasty Puppy',  to: to({ petType: 'DOG', kind: 'FEED', brand: 'Dasty', q: 'puppy' }) },
                    { label: 'Spiky — сухі корми',   to: to({ petType: 'DOG', kind: 'FEED', brand: 'Spiky', q: 'сух' }) },
                    { label: 'Spiky — вологі корми', to: to({ petType: 'DOG', kind: 'FEED', brand: 'Spiky', q: 'волог' }) },
                ],
            },
            {
                title: 'Ласощі для собак',
                items: [
                    { label: 'Всі ласощі для собак', to: to({ petType: 'DOG', kind: 'TREAT' }) },
                    { label: 'Dasty — ласощі',       to: to({ petType: 'DOG', kind: 'TREAT', brand: 'Dasty' }) },
                    { label: 'Spiky — ласощі',       to: to({ petType: 'DOG', kind: 'TREAT', brand: 'Spiky' }) },
                ],
            },
            {
                title: 'Амуниція для собак',
                items: [
                    { label: 'Вся амуніція для собак', to: to({ petType: 'DOG', kind: 'GEAR' }) },
                    { label: 'Повідки',                to: to({ petType: 'DOG', kind: 'GEAR', q: 'повід' }) },
                    { label: 'Шлейки',                 to: to({ petType: 'DOG', kind: 'GEAR', q: 'шлей' }) },
                    { label: 'Нашийники',              to: to({ petType: 'DOG', kind: 'GEAR', q: 'наш' }) },
                ],
            },
        ],
    },

    /* ===================== Котам ===================== */
    {
        key: 'cats',
        icon: '🐱',
        label: 'Котам',
        columns: [
            {
                title: 'Корм для котів',
                items: [
                    { label: 'Весь корм для котів',   to: to({ petType: 'CAT', kind: 'FEED' }) },

                    { label: 'Fincsi Sterilised',     to: to({ petType: 'CAT', kind: 'FEED', brand: 'Fincsi', q: 'steril' }) },
                    { label: 'Fincsi Indoor',         to: to({ petType: 'CAT', kind: 'FEED', brand: 'Fincsi', q: 'indoor' }) },
                    { label: 'Fincsi Kitten',         to: to({ petType: 'CAT', kind: 'FEED', brand: 'Fincsi', q: 'kitten' }) },

                    { label: 'Cattos Grain Free',     to: to({ petType: 'CAT', kind: 'FEED', brand: 'Cattos', q: 'grain free' }) },
                    { label: 'Cattos Hairball',       to: to({ petType: 'CAT', kind: 'FEED', brand: 'Cattos', q: 'hairball' }) },
                ],
            },
            {
                title: 'Ласощі для котів',
                items: [
                    { label: 'Всі ласощі для котів',  to: to({ petType: 'CAT', kind: 'TREAT' }) },
                    { label: 'Подушечки',             to: to({ petType: 'CAT', kind: 'TREAT', q: 'подуш' }) },
                    { label: 'Паштети-ласощі',        to: to({ petType: 'CAT', kind: 'TREAT', q: 'пашт' }) },
                ],
            },
            {
                title: 'Догляд та аксесуари',
                items: [
                    { label: 'Наповнювачі',           to: to({ petType: 'CAT', kind: 'ACCESSORY', q: 'наповнювач' }) },
                    { label: 'Туалети / лотки',       to: to({ petType: 'CAT', kind: 'ACCESSORY', q: 'туалет' }) },
                    { label: 'Іграшки для котів',     to: to({ petType: 'CAT', kind: 'ACCESSORY', q: 'іграш' }) },
                ],
            },
        ],
    },

    /* ===================== Амуниція ===================== */
    {
        key: 'gear',
        icon: '🦴',
        label: 'Амуниція',
        columns: [
            {
                title: 'Для собак',
                items: [
                    { label: 'Вся амуніція для собак', to: to({ petType: 'DOG', kind: 'GEAR' }) },
                    { label: 'Повідки',                to: to({ petType: 'DOG', kind: 'GEAR', q: 'повід' }) },
                    { label: 'Шлейки',                 to: to({ petType: 'DOG', kind: 'GEAR', q: 'шлей' }) },
                    { label: 'Нашийники',              to: to({ petType: 'DOG', kind: 'GEAR', q: 'наш' }) },
                ],
            },
            {
                title: 'Для котів',
                items: [
                    { label: 'Вся амуніція для котів', to: to({ petType: 'CAT', kind: 'GEAR' }) },
                    { label: 'Шлейки для котів',       to: to({ petType: 'CAT', kind: 'GEAR', q: 'шлей' }) },
                    { label: 'Повідки для котів',      to: to({ petType: 'CAT', kind: 'GEAR', q: 'повід' }) },
                ],
            },
            {
                title: 'Аксесуари',
                items: [
                    { label: 'Миски та поїлки',        to: to({ kind: 'ACCESSORY', q: 'мис' }) },
                    { label: 'Переноски',              to: to({ kind: 'ACCESSORY', q: 'переноск' }) },
                    { label: 'Будинки / лежаки',       to: to({ kind: 'ACCESSORY', q: 'леж' }) },
                ],
            },
        ],
    },

    /* ===================== Ласощі ===================== */
    {
        key: 'treats',
        icon: '🍖',
        label: 'Ласощі',
        columns: [
            {
                title: 'Для собак',
                items: [
                    { label: 'Всі ласощі для собак', to: to({ petType: 'DOG', kind: 'TREAT' }) },
                    { label: 'Палички',              to: to({ petType: 'DOG', kind: 'TREAT', q: 'пал' }) },
                    { label: 'Кісточки',             to: to({ petType: 'DOG', kind: 'TREAT', q: 'кіст' }) },
                ],
            },
            {
                title: 'Для котів',
                items: [
                    { label: 'Всі ласощі для котів', to: to({ petType: 'CAT', kind: 'TREAT' }) },
                    { label: 'Подушечки',            to: to({ petType: 'CAT', kind: 'TREAT', q: 'подуш' }) },
                    { label: 'Паштети-ласощі',       to: to({ petType: 'CAT', kind: 'TREAT', q: 'пашт' }) },
                ],
            },
            {
                title: 'За брендом',
                items: [
                    { label: 'Dasty — ласощі',  to: to({ kind: 'TREAT', brand: 'Dasty' }) },
                    { label: 'Fincsi — ласощі', to: to({ kind: 'TREAT', brand: 'Fincsi' }) },
                    { label: 'Spiky — ласощі',  to: to({ kind: 'TREAT', brand: 'Spiky' }) },
                    { label: 'Cattos — ласощі', to: to({ kind: 'TREAT', brand: 'Cattos' }) },
                ],
            },
        ],
    },
];
