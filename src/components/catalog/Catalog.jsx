export const TOP_CATEGORIES = [
  { name: 'Корм',     slug: 'feed'   },
  { name: 'Іграшки',  slug: 'toys'   },
  { name: 'Амуниція', slug: 'ammo'   },
  { name: 'Посуд',    slug: 'dishes' },
];


export const POPULAR_CHIPS = TOP_CATEGORIES.map(c => ({
  label: c.name,
  params: { cat: c.name }
}));

export const POPULAR = [
    { label: 'Корм', params: { cat: 'Корм' } },
    { label: 'Іграшки', params: { cat: 'Іграшки' } },
    { label: 'Амуниція', params: { cat: 'Амуниція' } },
    { label: 'Посуд', params: { cat: 'Посуд' } },
    { label: 'Лакомства', params: { cat: 'Лакомства' } },
    'Royal Canin',
    'Brit Care',
    'Вітаміни для котів',
    'Автопоїлка для собак'
];