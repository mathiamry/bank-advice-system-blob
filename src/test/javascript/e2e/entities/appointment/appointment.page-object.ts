import { element, by, ElementFinder } from 'protractor';

export class AppointmentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-appointment div table .btn-danger'));
  title = element.all(by.css('jhi-appointment div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class AppointmentUpdatePage {
  pageTitle = element(by.id('jhi-appointment-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  createdInput = element(by.id('field_created'));
  appointementDateInput = element(by.id('field_appointementDate'));
  startDateInput = element(by.id('field_startDate'));
  endDateInput = element(by.id('field_endDate'));
  titleInput = element(by.id('field_title'));
  descriptionInput = element(by.id('field_description'));
  statusSelect = element(by.id('field_status'));
  statusChangeDateInput = element(by.id('field_statusChangeDate'));
  commentaryInput = element(by.id('field_commentary'));

  managerSelect = element(by.id('field_manager'));
  advisorSelect = element(by.id('field_advisor'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setCreatedInput(created: string): Promise<void> {
    await this.createdInput.sendKeys(created);
  }

  async getCreatedInput(): Promise<string> {
    return await this.createdInput.getAttribute('value');
  }

  async setAppointementDateInput(appointementDate: string): Promise<void> {
    await this.appointementDateInput.sendKeys(appointementDate);
  }

  async getAppointementDateInput(): Promise<string> {
    return await this.appointementDateInput.getAttribute('value');
  }

  async setStartDateInput(startDate: string): Promise<void> {
    await this.startDateInput.sendKeys(startDate);
  }

  async getStartDateInput(): Promise<string> {
    return await this.startDateInput.getAttribute('value');
  }

  async setEndDateInput(endDate: string): Promise<void> {
    await this.endDateInput.sendKeys(endDate);
  }

  async getEndDateInput(): Promise<string> {
    return await this.endDateInput.getAttribute('value');
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getAttribute('value');
  }

  async setDescriptionInput(description: string): Promise<void> {
    await this.descriptionInput.sendKeys(description);
  }

  async getDescriptionInput(): Promise<string> {
    return await this.descriptionInput.getAttribute('value');
  }

  async setStatusSelect(status: string): Promise<void> {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }

  async setStatusChangeDateInput(statusChangeDate: string): Promise<void> {
    await this.statusChangeDateInput.sendKeys(statusChangeDate);
  }

  async getStatusChangeDateInput(): Promise<string> {
    return await this.statusChangeDateInput.getAttribute('value');
  }

  async setCommentaryInput(commentary: string): Promise<void> {
    await this.commentaryInput.sendKeys(commentary);
  }

  async getCommentaryInput(): Promise<string> {
    return await this.commentaryInput.getAttribute('value');
  }

  async managerSelectLastOption(): Promise<void> {
    await this.managerSelect.all(by.tagName('option')).last().click();
  }

  async managerSelectOption(option: string): Promise<void> {
    await this.managerSelect.sendKeys(option);
  }

  getManagerSelect(): ElementFinder {
    return this.managerSelect;
  }

  async getManagerSelectedOption(): Promise<string> {
    return await this.managerSelect.element(by.css('option:checked')).getText();
  }

  async advisorSelectLastOption(): Promise<void> {
    await this.advisorSelect.all(by.tagName('option')).last().click();
  }

  async advisorSelectOption(option: string): Promise<void> {
    await this.advisorSelect.sendKeys(option);
  }

  getAdvisorSelect(): ElementFinder {
    return this.advisorSelect;
  }

  async getAdvisorSelectedOption(): Promise<string> {
    return await this.advisorSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class AppointmentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-appointment-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-appointment'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
