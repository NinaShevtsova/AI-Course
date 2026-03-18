export type Credentials = {
  username: string;
  password: string;
};

export type CheckoutTestData = {
  productName: string;
  productPrice: number;
  expectedTotal: string;
};

export type AuthTestData = {
  validUser: Credentials;
  invalidUser: Credentials;
  invalidLoginMessage: string;
  requiredFieldsMessage: string;
};

export type SearchResultData = {
  title: string;
  price: number;
};

export type SearchTestData = {
  query: string;
  filterName: string;
  maxPrice: number;
  results: SearchResultData[];
};

/**
 * Provides immutable credentials and expected messages for auth scenarios.
 */
export function getAuthTestData(): AuthTestData {
  return {
    validUser: {
      username: 'qa.user',
      password: 'Secret123',
    },
    invalidUser: {
      username: 'qa.user',
      password: 'WrongPass123',
    },
    invalidLoginMessage: 'Invalid credentials',
    requiredFieldsMessage: 'Username and password are required',
  };
}

/**
 * Provides static checkout values used by isolated checkout flow tests.
 */
export function getCheckoutTestData(): CheckoutTestData {
  return {
    productName: 'E2E Backpack',
    productPrice: 100,
    expectedTotal: '$100',
  };
}

/**
 * Provides search query, filter, and expected result pricing for search scenarios.
 */
export function getSearchTestData(): SearchTestData {
  return {
    query: 'Laptop',
    filterName: 'Price < $1000',
    maxPrice: 1000,
    results: [
      {
        title: 'Laptop',
        price: 999,
      },
      {
        title: 'Laptop Air',
        price: 899,
      },
      {
        title: 'Laptop Pro',
        price: 1299,
      },
    ],
  };
}
