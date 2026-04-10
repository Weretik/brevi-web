type MenuLink = readonly string[];

export type HeaderMenuLeaf = {
  label: string;
  routerLink: MenuLink;
};

export type HeaderMenuSection = {
  label: string;
  items?: HeaderMenuLeaf[];
};

export type HeaderMenuPromo = {
  image: string;
  label: string;
  routerLink: string;
  subtext: string;
};

const catalogLink = (): MenuLink => ['/catalog'] as const;

const infoLink = (path: string): MenuLink => [path] as const;

export const MENU_TEXT = {
  catalog: 'header.menu.catalog',
  information: 'header.menu.information',
} as const;

export const CATALOG_COLUMNS: HeaderMenuSection[][] = [
  [
    {
      label: 'header.catalog.section.summer',
      items: [
        {
          label: 'header.catalog.item.summer.suits',
          routerLink: catalogLink('summer-workwear'),
        },
        {
          label: 'header.catalog.item.summer.jackets',
          routerLink: catalogLink('summer-jackets'),
        },
        {
          label: 'header.catalog.item.summer.overalls',
          routerLink: catalogLink('summer-overalls'),
        },
        {
          label: 'header.catalog.item.summer.pants',
          routerLink: catalogLink('summer-pants'),
        },
      ],
    },
    {
      label: 'header.catalog.section.winter',
      items: [
        {
          label: 'header.catalog.item.winter.jackets',
          routerLink: catalogLink('winter-jackets'),
        },
        {
          label: 'header.catalog.item.winter.pants',
          routerLink: catalogLink('winter-pants'),
        },
        {
          label: 'header.catalog.item.winter.overalls',
          routerLink: catalogLink('winter-overalls'),
        },
        {
          label: 'header.catalog.item.winter.vests',
          routerLink: catalogLink('winter-vests'),
        },
      ],
    },
  ],
  [
    {
      label: 'header.catalog.section.knitwear',
      items: [
        {
          label: 'header.catalog.item.knitwear.tshirts',
          routerLink: catalogLink('work-tshirts'),
        },
        {
          label: 'header.catalog.item.knitwear.polo',
          routerLink: catalogLink('polo'),
        },
        {
          label: 'header.catalog.item.knitwear.sweaters',
          routerLink: catalogLink('sweaters'),
        },
      ],
    },
    {
      label: 'header.catalog.section.waterproof',
      items: [
        {
          label: 'header.catalog.item.waterproof.aprons',
          routerLink: catalogLink('waterproof-aprons'),
        },
        {
          label: 'header.catalog.item.waterproof.suits',
          routerLink: catalogLink('waterproof-suits'),
        },
        {
          label: 'header.catalog.item.waterproof.raincoats',
          routerLink: catalogLink('waterproof-raincoats'),
        },
      ],
    },
  ],
  [
    {
      label: 'header.catalog.section.shoes',
      items: [
        {
          label: 'header.catalog.item.shoes.summer',
          routerLink: catalogLink('summer-work-shoes'),
        },
        {
          label: 'header.catalog.item.shoes.winter',
          routerLink: catalogLink('winter-work-shoes'),
        },
      ],
    },
    {
      label: 'header.catalog.section.handProtection',
      items: [
        {
          label: 'header.catalog.item.hands.knitted',
          routerLink: catalogLink('knitted-gloves'),
        },
        {
          label: 'header.catalog.item.hands.warmed',
          routerLink: catalogLink('insulated-gloves'),
        },
        {
          label: 'header.catalog.item.hands.nitrile',
          routerLink: catalogLink('nitrile-gloves'),
        },
      ],
    },
  ],
  [
    {
      label: 'header.catalog.section.eyeProtection',
      items: [
        {
          label: 'header.catalog.item.eyes.glasses',
          routerLink: catalogLink('protective-glasses'),
        },
        {
          label: 'header.catalog.item.eyes.shields',
          routerLink: catalogLink('protective-shields'),
        },
      ],
    },
    {
      label: 'header.catalog.section.respiratory',
      items: [
        {
          label: 'header.catalog.item.respiratory.respirators',
          routerLink: catalogLink('respirators'),
        },
        {
          label: 'header.catalog.item.respiratory.filters',
          routerLink: catalogLink('respirator-filters'),
        },
      ],
    },
  ],
];

export const INFO_ABOUT_ITEMS: HeaderMenuLeaf[] = [
  { label: 'header.menu.aboutCompany', routerLink: infoLink('/about-company') },
  {
    label: 'header.menu.deliveryAndPayment',
    routerLink: infoLink('/delivery-and-payment'),
  },
  {
    label: 'header.menu.returnsExchanges',
    routerLink: infoLink('/returns-exchanges'),
  },
  { label: 'header.menu.articles', routerLink: infoLink('/articles') },
  { label: 'header.menu.contacts', routerLink: infoLink('/contacts') },
];

export const INFO_REGION_ITEMS: HeaderMenuLeaf[] = [
  { label: 'header.menu.region.kharkiv', routerLink: infoLink('/regions') },
  { label: 'header.menu.region.kyiv', routerLink: infoLink('/regions') },
  { label: 'header.menu.region.dnipro', routerLink: infoLink('/regions') },
  { label: 'header.menu.region.zaporizhzhia', routerLink: infoLink('/regions') },
  { label: 'header.menu.region.odesa', routerLink: infoLink('/regions') },
  { label: 'header.menu.region.poltava', routerLink: infoLink('/regions') },
  { label: 'header.menu.region.lviv', routerLink: infoLink('/regions') },
];

export const INFO_LEGAL_ITEMS: HeaderMenuSection = {
  label: 'header.menu.legal',
  items: [
    { label: 'header.menu.userAgreement', routerLink: infoLink('/agreement') },
    { label: 'header.menu.privacyPolicy', routerLink: infoLink('/agreement') },
    { label: 'header.menu.publicOffer', routerLink: infoLink('/agreement') },
  ],
};

export const INFO_PROMO_ITEM: HeaderMenuPromo = {
  image: 'https://primefaces.org/cdn/primeng/images/uikit/uikit-system.png',
  label: 'header.menu.wholesale',
  routerLink: '/order-in-bulk',
  subtext: 'header.menu.wholesaleSubtext',
};
