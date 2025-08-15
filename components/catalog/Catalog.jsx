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