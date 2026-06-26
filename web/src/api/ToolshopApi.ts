import { APIRequestContext } from '@playwright/test';
import { API, ENV } from '../constants';
import { UserFactory, UserCredentials } from '../factories/userFactory';

export class ToolshopApi {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(): Promise<UserCredentials> {
    const user = UserFactory.build();
    const response = await this.request.post(`${ENV.apiUrl}${API.register}`, { data: user.payload });
    if (!response.ok()) {
      throw new Error(`Failed to register user: ${response.status()} ${await response.text()}`);
    }
    return user.credentials;
  }

  async login(email: string, password: string): Promise<string> {
    const response = await this.request.post(`${ENV.apiUrl}${API.login}`, {
      data: { email, password },
    });
    if (!response.ok()) {
      throw new Error(`Failed to login: ${response.status()} ${await response.text()}`);
    }
    const body = await response.json();
    return body.access_token as string;
  }

  async createAuthenticatedUser(): Promise<UserCredentials & { token: string }> {
    const credentials = await this.createUser();
    const token = await this.login(credentials.email, credentials.password);
    return { ...credentials, token };
  }
}
