import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ManagerComponentsPage,
  /* ManagerDeleteDialog, */
  ManagerUpdatePage,
} from './manager.page-object';

const expect = chai.expect;

describe('Manager e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let managerComponentsPage: ManagerComponentsPage;
  let managerUpdatePage: ManagerUpdatePage;
  /* let managerDeleteDialog: ManagerDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Managers', async () => {
    await navBarPage.goToEntity('manager');
    managerComponentsPage = new ManagerComponentsPage();
    await browser.wait(ec.visibilityOf(managerComponentsPage.title), 5000);
    expect(await managerComponentsPage.getTitle()).to.eq('bankAdviceSystemApp.manager.home.title');
    await browser.wait(ec.or(ec.visibilityOf(managerComponentsPage.entities), ec.visibilityOf(managerComponentsPage.noResult)), 1000);
  });

  it('should load create Manager page', async () => {
    await managerComponentsPage.clickOnCreateButton();
    managerUpdatePage = new ManagerUpdatePage();
    expect(await managerUpdatePage.getPageTitle()).to.eq('bankAdviceSystemApp.manager.home.createOrEditLabel');
    await managerUpdatePage.cancel();
  });

  /* it('should create and save Managers', async () => {
        const nbButtonsBeforeCreate = await managerComponentsPage.countDeleteButtons();

        await managerComponentsPage.clickOnCreateButton();

        await promise.all([
            managerUpdatePage.genderSelectLastOption(),
            managerUpdatePage.setTelephoneInput('telephone'),
            managerUpdatePage.userSelectLastOption(),
        ]);

        await managerUpdatePage.save();
        expect(await managerUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await managerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Manager', async () => {
        const nbButtonsBeforeDelete = await managerComponentsPage.countDeleteButtons();
        await managerComponentsPage.clickOnLastDeleteButton();

        managerDeleteDialog = new ManagerDeleteDialog();
        expect(await managerDeleteDialog.getDialogTitle())
            .to.eq('bankAdviceSystemApp.manager.delete.question');
        await managerDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(managerComponentsPage.title), 5000);

        expect(await managerComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
