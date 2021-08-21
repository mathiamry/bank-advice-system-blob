import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EnterpriseComponentsPage, EnterpriseDeleteDialog, EnterpriseUpdatePage } from './enterprise.page-object';

const expect = chai.expect;

describe('Enterprise e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let enterpriseComponentsPage: EnterpriseComponentsPage;
  let enterpriseUpdatePage: EnterpriseUpdatePage;
  let enterpriseDeleteDialog: EnterpriseDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Enterprises', async () => {
    await navBarPage.goToEntity('enterprise');
    enterpriseComponentsPage = new EnterpriseComponentsPage();
    await browser.wait(ec.visibilityOf(enterpriseComponentsPage.title), 5000);
    expect(await enterpriseComponentsPage.getTitle()).to.eq('bankAdviceSystemApp.enterprise.home.title');
    await browser.wait(ec.or(ec.visibilityOf(enterpriseComponentsPage.entities), ec.visibilityOf(enterpriseComponentsPage.noResult)), 1000);
  });

  it('should load create Enterprise page', async () => {
    await enterpriseComponentsPage.clickOnCreateButton();
    enterpriseUpdatePage = new EnterpriseUpdatePage();
    expect(await enterpriseUpdatePage.getPageTitle()).to.eq('bankAdviceSystemApp.enterprise.home.createOrEditLabel');
    await enterpriseUpdatePage.cancel();
  });

  it('should create and save Enterprises', async () => {
    const nbButtonsBeforeCreate = await enterpriseComponentsPage.countDeleteButtons();

    await enterpriseComponentsPage.clickOnCreateButton();

    await promise.all([
      enterpriseUpdatePage.setNameInput('name'),
      enterpriseUpdatePage.setAddressInput('address'),
      enterpriseUpdatePage.setNineaInput('ninea'),
      enterpriseUpdatePage.setEmailInput('v@ZgOl.qG'),
      enterpriseUpdatePage.managerSelectLastOption(),
    ]);

    await enterpriseUpdatePage.save();
    expect(await enterpriseUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await enterpriseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Enterprise', async () => {
    const nbButtonsBeforeDelete = await enterpriseComponentsPage.countDeleteButtons();
    await enterpriseComponentsPage.clickOnLastDeleteButton();

    enterpriseDeleteDialog = new EnterpriseDeleteDialog();
    expect(await enterpriseDeleteDialog.getDialogTitle()).to.eq('bankAdviceSystemApp.enterprise.delete.question');
    await enterpriseDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(enterpriseComponentsPage.title), 5000);

    expect(await enterpriseComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
