import { browser, ExpectedConditions as ec /* , promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  AdvisorComponentsPage,
  /* AdvisorDeleteDialog, */
  AdvisorUpdatePage,
} from './advisor.page-object';

const expect = chai.expect;

describe('Advisor e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let advisorComponentsPage: AdvisorComponentsPage;
  let advisorUpdatePage: AdvisorUpdatePage;
  /* let advisorDeleteDialog: AdvisorDeleteDialog; */
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Advisors', async () => {
    await navBarPage.goToEntity('advisor');
    advisorComponentsPage = new AdvisorComponentsPage();
    await browser.wait(ec.visibilityOf(advisorComponentsPage.title), 5000);
    expect(await advisorComponentsPage.getTitle()).to.eq('bankAdviceSystemApp.advisor.home.title');
    await browser.wait(ec.or(ec.visibilityOf(advisorComponentsPage.entities), ec.visibilityOf(advisorComponentsPage.noResult)), 1000);
  });

  it('should load create Advisor page', async () => {
    await advisorComponentsPage.clickOnCreateButton();
    advisorUpdatePage = new AdvisorUpdatePage();
    expect(await advisorUpdatePage.getPageTitle()).to.eq('bankAdviceSystemApp.advisor.home.createOrEditLabel');
    await advisorUpdatePage.cancel();
  });

  /* it('should create and save Advisors', async () => {
        const nbButtonsBeforeCreate = await advisorComponentsPage.countDeleteButtons();

        await advisorComponentsPage.clickOnCreateButton();

        await promise.all([
            advisorUpdatePage.genderSelectLastOption(),
            advisorUpdatePage.setTelephoneInput('telephone'),
            advisorUpdatePage.userSelectLastOption(),
            advisorUpdatePage.bankSelectLastOption(),
        ]);

        await advisorUpdatePage.save();
        expect(await advisorUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await advisorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Advisor', async () => {
        const nbButtonsBeforeDelete = await advisorComponentsPage.countDeleteButtons();
        await advisorComponentsPage.clickOnLastDeleteButton();

        advisorDeleteDialog = new AdvisorDeleteDialog();
        expect(await advisorDeleteDialog.getDialogTitle())
            .to.eq('bankAdviceSystemApp.advisor.delete.question');
        await advisorDeleteDialog.clickOnConfirmButton();
        await browser.wait(ec.visibilityOf(advisorComponentsPage.title), 5000);

        expect(await advisorComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
