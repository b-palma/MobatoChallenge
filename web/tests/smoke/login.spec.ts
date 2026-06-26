import { test } from '../../src/fixtures/test.fixture';
import { TAGS, TEST_DATA } from '../../src/constants';

test.describe('Login', () => {
  test(`${TAGS.smoke} should login with newly registered user`, async ({ loginPage, api }) => {
    const user = await api.createUser();

    await loginPage.open();
    await loginPage.login(user.email, user.password);
    await loginPage.expectSuccessfulLogin();
    await loginPage.expectLoggedInAs(`${TEST_DATA.userDefaults.firstName} ${TEST_DATA.userDefaults.lastName}`);
  });
});
