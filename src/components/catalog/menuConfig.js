// Все лінки ведуть на /products з query brand / category (твій бек уже це вміє)
const to = (params = {}) =>
    "/products?" + new URLSearchParams(params).toString();

export const MENU_SECTIONS = [
    {
        key: "dasty",
        icon: "🐶",
        label: "Dasty (собаки)",
        columns: [
            {
                title: "Сухі корми",
                items: [
                    { label: "Adult", to: to({ brand: "Dasty", category: "Корм", q: "adult" }) },
                    { label: "Puppy", to: to({ brand: "Dasty", category: "Корм", q: "puppy" }) },
                    { label: "Weight Control", to: to({ brand: "Dasty", category: "Корм", q: "weight" }) },
                    { label: "Сухі — всі", to: to({ brand: "Dasty", category: "Корм" }) },
                ],
            },
            {
                title: "Ласощі",
                items: [
                    { label: "Палички", to: to({ brand: "Dasty", category: "Ласощі", q: "stick" }) },
                    { label: "Кісточки", to: to({ brand: "Dasty", category: "Ласощі", q: "bone" }) },
                    { label: "Ласощі — всі", to: to({ brand: "Dasty", category: "Ласощі" }) },
                ],
            },
            {
                title: "Аксесуари",
                items: [
                    { label: "Повідки",  to: to({ brand: "Dasty", category: "Амуниція" }) },
                    { label: "Іграшки",  to: to({ brand: "Dasty", category: "Іграшки" }) },
                    { label: "Миски",    to: to({ brand: "Dasty", category: "Посуд" }) },
                ],
            },
        ],
    },

    {
        key: "fincsi",
        icon: "🐱",
        label: "Fincsi (коти)",
        columns: [
            {
                title: "Сухі корми",
                items: [
                    { label: "Sterilised", to: to({ brand: "Fincsi", category: "Корм", q: "steril" }) },
                    { label: "Indoor",     to: to({ brand: "Fincsi", category: "Корм", q: "indoor" }) },
                    { label: "Kitten",     to: to({ brand: "Fincsi", category: "Корм", q: "kitten" }) },
                    { label: "Сухі — всі", to: to({ brand: "Fincsi", category: "Корм" }) },
                ],
            },
            {
                title: "Вологі корми",
                items: [
                    { label: "Паштет",  to: to({ brand: "Fincsi", category: "Корм", q: "паштет" }) },
                    { label: "Шматочки", to: to({ brand: "Fincsi", category: "Корм", q: "шмат" }) },
                ],
            },
            {
                title: "Інше",
                items: [
                    { label: "Ласощі",   to: to({ brand: "Fincsi", category: "Ласощі" }) },
                    { label: "Наповнювач", to: to({ brand: "Fincsi", category: "Гігієна", q: "нап" }) },
                ],
            },
        ],
    },

    {
        key: "spiky",
        icon: "🦔",
        label: "Spiky (універсальні)",
        columns: [
            {
                title: "Популярне",
                items: [
                    { label: "Корм — всі",      to: to({ brand: "Spiky", category: "Корм" }) },
                    { label: "Іграшки — всі",   to: to({ brand: "Spiky", category: "Іграшки" }) },
                    { label: "Амуниція — всі",  to: to({ brand: "Spiky", category: "Амуниція" }) },
                ],
            },
            {
                title: "Догляд",
                items: [
                    { label: "Вітаміни", to: to({ brand: "Spiky", category: "Вітаміни" }) },
                    { label: "Гігієна",  to: to({ brand: "Spiky", category: "Гігієна" }) },
                ],
            },
        ],
    },

    {
        key: "cattos",
        icon: "🐾",
        label: "Cattos (коти)",
        columns: [
            {
                title: "Сухі корми",
                items: [
                    { label: "Grain Free", to: to({ brand: "Cattos", category: "Корм", q: "grain free" }) },
                    { label: "Hairball",   to: to({ brand: "Cattos", category: "Корм", q: "hairball" }) },
                ],
            },
            {
                title: "Ласощі",
                items: [
                    { label: "Подушечки", to: to({ brand: "Cattos", category: "Ласощі", q: "подуш" }) },
                    { label: "Паштети",   to: to({ brand: "Cattos", category: "Ласощі", q: "пашт" }) },
                ],
            },
        ],
    },
];

export const ALL_CATEGORIES_LINK = to({}); // «Всі категорії» -> просто /products
