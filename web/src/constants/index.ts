export const ENV = {
  baseUrl: process.env.BASE_URL ?? 'https://practicesoftwaretesting.com',
  apiUrl: process.env.API_URL ?? 'https://api.practicesoftwaretesting.com',
} as const;

export const ROUTES = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  checkout: '/checkout',
  account: '/account',
  product: (id: string) => `/product/${id}`,
} as const;

export const API = {
  register: '/users/register',
  login: '/users/login',
  products: '/products',
  carts: '/carts',
} as const;

export const SELECTORS = {
  login: {
    form: 'login-form',
    email: 'email',
    password: 'password',
    submit: 'login-submit',
    registerLink: 'register-link',
  },
  nav: {
    signIn: 'nav-sign-in',
    home: 'nav-home',
    cart: 'nav-cart',
  },
  products: {
    searchQuery: 'search-query',
    searchSubmit: 'search-submit',
    searchReset: 'search-reset',
    name: 'product-name',
    price: 'product-price',
    addToCart: 'add-to-cart',
    card: (id: string) => `product-${id}`,
  },
  cart: {
    item: 'cart-item',
    quantity: 'cart-quantity',
    total: 'cart-total',
    linePrice: 'line-price',
    productTitle: 'product-title',
    proceed: 'proceed-checkout',
    empty: 'cart-empty',
  },
  checkout: {
    proceed1: 'proceed-1',
    proceed2: 'proceed-2',
    proceed3: 'proceed-3',
    country: 'country',
    postalCode: 'postal_code',
    houseNumber: 'house_number',
    street: 'street',
    city: 'city',
    state: 'state',
    paymentMethod: 'payment-method',
    finish: 'finish',
  },
  register: {
    firstName: 'first-name',
    lastName: 'last-name',
    email: 'email',
    password: 'password',
    dob: 'dob',
    phone: 'phone',
    street: 'street',
    city: 'city',
    state: 'state',
    country: 'country',
    postalCode: 'postal_code',
    submit: 'register-submit',
  },
} as const;

export const TEXT = {
  signIn: 'Sign in',
  search: 'Search',
  addToCart: 'Add to cart',
  loginSuccessHeading: 'My account',
  emptyCart: 'The cart is empty',
  orderConfirmed: 'Payment was successful',
  bankName: 'Bank Name',
  accountName: 'Account Name',
  accountNumber: 'Account Number',
} as const;

export const TEST_DATA = {
  searchScenarios: [
    {
      term: 'Hammer',
      expectedProducts: ['Claw Hammer', 'Thor Hammer'],
      minimumResults: 2,
    },
    {
      term: 'Pliers',
      expectedProducts: ['Combination Pliers', 'Pliers'],
      minimumResults: 2,
    },
  ],
  productName: 'Claw Hammer',
  defaultPasswordPrefix: 'MobatoQa!',
  checkout: {
    paymentMethod: 'Bank Transfer',
    bankName: 'Banco Teste',
    accountName: 'Bruno Amaral',
    accountNumber: '1234567890',
  },
  userDefaults: {
    firstName: 'Bruno',
    lastName: 'Amaral',
    dob: '1990-01-15',
    phone: '11999999999',
    address: {
      street: 'Rua Teste 123',
      houseNumber: '100',
      city: 'Sao Paulo',
      state: 'SP',
      country: 'BR',
      postalCode: '01001000',
    },
  },
} as const;

export const TAGS = {
  smoke: '@smoke',
} as const;
