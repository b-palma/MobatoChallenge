import { TEST_DATA } from '../constants';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserPayload extends UserCredentials {
  first_name: string;
  last_name: string;
  dob: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
}

export class UserFactory {
  static build(): { credentials: UserCredentials; payload: UserPayload } {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const password = `${TEST_DATA.defaultPasswordPrefix}${suffix}`;
    const email = `bruno-${suffix}@mobato.test`;

    return {
      credentials: { email, password },
      payload: {
        email,
        password,
        first_name: TEST_DATA.userDefaults.firstName,
        last_name: TEST_DATA.userDefaults.lastName,
        dob: TEST_DATA.userDefaults.dob,
        phone: TEST_DATA.userDefaults.phone,
        address: {
          street: TEST_DATA.userDefaults.address.street,
          city: TEST_DATA.userDefaults.address.city,
          state: TEST_DATA.userDefaults.address.state,
          country: TEST_DATA.userDefaults.address.country,
          postal_code: TEST_DATA.userDefaults.address.postalCode,
        },
      },
    };
  }
}
