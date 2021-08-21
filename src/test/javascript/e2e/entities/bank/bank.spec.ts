import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { BankComponentsPage, BankDeleteDialog, BankUpdatePage } from './bank.page-object';

const expect = chai.expect;

describe('Bank e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let bankComponentsPage: BankComponentsPage;
  let bankUpdatePage: BankUpdatePage;
  let bankDeleteDialog: BankDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Banks', async () => {
    await navBarPage.goToEntity('bank');
    bankComponentsPage = new BankComponentsPage();
    await browser.wait(ec.visibilityOf(bankComponentsPage.title), 5000);
    expect(await bankComponentsPage.getTitle()).to.eq('bankAdviceSystemApp.bank.home.title');
    await browser.wait(ec.or(ec.visibilityOf(bankComponentsPage.entities), ec.visibilityOf(bankComponentsPage.noResult)), 1000);
  });

  it('should load create Bank page', async () => {
    await bankComponentsPage.clickOnCreateButton();
    bankUpdatePage = new BankUpdatePage();
    expect(await bankUpdatePage.getPageTitle()).to.eq('bankAdviceSystemApp.bank.home.createOrEditLabel');
    await bankUpdatePage.cancel();
  });

  it('should create and save Banks', async () => {
    const nbButtonsBeforeCreate = await bankComponentsPage.countDeleteButtons();

    await bankComponentsPage.clickOnCreateButton();

    await promise.all([
      bankUpdatePage.setNameInput('name'),
      bankUpdatePage.setAddressInput('address'),
      bankUpdatePage.setContactInput('contact'),
      bankUpdatePage.setEmailInput('8j@z1CL.bUI'),
    ]);

    await bankUpdatePage.save();
    expect(await bankUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await bankComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Bank', async () => {
    const nbButtonsBeforeDelete = await bankComponentsPage.countDeleteButtons();
    await bankComponentsPage.clickOnLastDeleteButton();

    bankDeleteDialog = new BankDeleteDialog();
    expect(await bankDeleteDialog.getDialogTitle()).to.eq('bankAdviceSystemApp.bank.delete.question');
    await bankDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(bankComponentsPage.title), 5000);

    expect(await bankComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
