// src/components/navbar/config/MenuConfig.js
import { to } from './linkBuilder';

// Основні категорії, які реально існують у Product.category
const FEED_DOG  = 'Корм для собак';
const FEED_CAT  = 'Корм для котів';
const GEAR      = 'Амуниція';
const TREATS    = 'Ласощі';

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
                    { label: 'Весь корм для собак', to: to({ category: FEED_DOG }) },

                    // приклади підбрендів — фільтруємо через q (пошук по name/description/category)
                    { label: 'Dasty Adult',          to: to({ category: FEED_DOG, q: 'Dasty adult' }) },
                    { label: 'Dasty Puppy',          to: to({ category: FEED_DOG, q: 'Dasty puppy' }) },
                    { label: 'Spiky — сухі корми',   to: to({ category: FEED_DOG, q: 'Spiky сухий' }) },
                    { label: 'Spiky — вологі корми', to: to({ category: FEED_DOG, q: 'Spiky волог' }) },
                ],
            },
            {
                title: 'Ласощі для собак',
                items: [
                    { label: 'Всі ласощі для собак', to: to({ category: TREATS, q: 'собак' }) },
                    { label: 'Dasty — ласощі',       to: to({ category: TREATS, q: 'Dasty' }) },
                    { label: 'Spiky — ласощі',       to: to({ category: TREATS, q: 'Spiky' }) },
                ],
            },
            {
                title: 'Амуниція для собак',
                items: [
                    { label: 'Вся амуніція для собак', to: to({ category: GEAR, q: 'собак' }) },
                    { label: 'Повідки',                to: to({ category: GEAR, q: 'повід' }) },
                    { label: 'Шлейки',                 to: to({ category: GEAR, q: 'шлей' }) },
                    { label: 'Нашийники',              to: to({ category: GEAR, q: 'нашийник' }) },
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
                    { label: 'Весь корм для котів',   to: to({ category: FEED_CAT }) },

                    { label: 'Fincsi Sterilised',     to: to({ category: FEED_CAT, q: 'Fincsi steril' }) },
                    { label: 'Fincsi Indoor',         to: to({ category: FEED_CAT, q: 'Fincsi indoor' }) },
                    { label: 'Fincsi Kitten',         to: to({ category: FEED_CAT, q: 'Fincsi kitten' }) },

                    { label: 'Cattos Grain Free',     to: to({ category: FEED_CAT, q: 'Cattos grain free' }) },
                    { label: 'Cattos Hairball',       to: to({ category: FEED_CAT, q: 'Cattos hairball' }) },
                ],
            },
            {
                title: 'Ласощі для котів',
                items: [
                    { label: 'Всі ласощі для котів',  to: to({ category: TREATS, q: 'кот' }) },
                    { label: 'Подушечки',             to: to({ category: TREATS, q: 'подуш' }) },
                    { label: 'Паштети-ласощі',        to: to({ category: TREATS, q: 'пашт' }) },
                ],
            },
            {
                title: 'Догляд та аксесуари',
                items: [
                    { label: 'Наповнювачі',           to: to({ category: GEAR, q: 'наповнювач' }) },
                    { label: 'Туалети / лотки',       to: to({ category: GEAR, q: 'туалет' }) },
                    { label: 'Іграшки для котів',     to: to({ category: GEAR, q: 'іграшк кот' }) },
                ],
            },
        ],
    },

    /* ===================== Амуниція (загальний розділ) ===================== */
    {
        key: 'gear',
        icon: '🦴',
        label: 'Амуниція',
        columns: [
            {
                title: 'Для собак',
                items: [
                    { label: 'Вся амуніція для собак', to: to({ category: GEAR, q: 'собак' }) },
                    { label: 'Повідки',                to: to({ category: GEAR, q: 'повід' }) },
                    { label: 'Шлейки',                 to: to({ category: GEAR, q: 'шлей' }) },
                    { label: 'Нашийники',              to: to({ category: GEAR, q: 'нашийник' }) },
                ],
            },
            {
                title: 'Для котів',
                items: [
                    { label: 'Вся амуніція для котів', to: to({ category: GEAR, q: 'кот' }) },
                    { label: 'Шлейки для котів',       to: to({ category: GEAR, q: 'шлей кот' }) },
                    { label: 'Повідки для котів',      to: to({ category: GEAR, q: 'повід кот' }) },
                ],
            },
            {
                title: 'Аксесуари',
                items: [
                    { label: 'Миски та поїлки',        to: to({ category: GEAR, q: 'мис' }) },
                    { label: 'Переноски',              to: to({ category: GEAR, q: 'переноск' }) },
                    { label: 'Будинки / лежаки',       to: to({ category: GEAR, q: 'леж' }) },
                ],
            },
        ],
    },

    /* ===================== Ласощі (загальний розділ) ===================== */
    {
        key: 'treats',
        icon: '🍖',
        label: 'Ласощі',
        columns: [
            {
                title: 'Для собак',
                items: [
                    { label: 'Всі ласощі для собак', to: to({ category: TREATS, q: 'собак' }) },
                    { label: 'Палички',              to: to({ category: TREATS, q: 'пал' }) },
                    { label: 'Кісточки',             to: to({ category: TREATS, q: 'кіст' }) },
                ],
            },
            {
                title: 'Для котів',
                items: [
                    { label: 'Всі ласощі для котів', to: to({ category: TREATS, q: 'кот' }) },
                    { label: 'Подушечки',            to: to({ category: TREATS, q: 'подуш' }) },
                    { label: 'Паштети-ласощі',       to: to({ category: TREATS, q: 'пашт' }) },
                ],
            },
            {
                title: 'За брендом',
                items: [
                    { label: 'Dasty — ласощі',  to: to({ category: TREATS, q: 'Dasty' }) },
                    { label: 'Fincsi — ласощі', to: to({ category: TREATS, q: 'Fincsi' }) },
                    { label: 'Spiky — ласощі',  to: to({ category: TREATS, q: 'Spiky' }) },
                    { label: 'Cattos — ласощі', to: to({ category: TREATS, q: 'Cattos' }) },
                ],
            },
        ],
    },
];
