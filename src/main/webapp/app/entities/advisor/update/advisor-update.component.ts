import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAdvisor, Advisor } from '../advisor.model';
import { AdvisorService } from '../service/advisor.service';
import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';

@Component({
  selector: 'jhi-advisor-update',
  templateUrl: './advisor-update.component.html',
})
export class AdvisorUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];
  banksSharedCollection: IBank[] = [];

  editForm = this.fb.group({
    id: [],
    gender: [],
    telephone: [null, [Validators.required, Validators.maxLength(20)]],
    user: [null, Validators.required],
    bank: [],
  });

  constructor(
    protected advisorService: AdvisorService,
    protected userService: UserService,
    protected bankService: BankService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ advisor }) => {
      this.updateForm(advisor);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const advisor = this.createFromForm();
    if (advisor.id !== undefined) {
      this.subscribeToSaveResponse(this.advisorService.update(advisor));
    } else {
      this.subscribeToSaveResponse(this.advisorService.create(advisor));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  trackBankById(index: number, item: IBank): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAdvisor>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(advisor: IAdvisor): void {
    this.editForm.patchValue({
      id: advisor.id,
      gender: advisor.gender,
      telephone: advisor.telephone,
      user: advisor.user,
      bank: advisor.bank,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(this.usersSharedCollection, advisor.user);
    this.banksSharedCollection = this.bankService.addBankToCollectionIfMissing(this.banksSharedCollection, advisor.bank);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing(users, this.editForm.get('user')!.value)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));

    this.bankService
      .query()
      .pipe(map((res: HttpResponse<IBank[]>) => res.body ?? []))
      .pipe(map((banks: IBank[]) => this.bankService.addBankToCollectionIfMissing(banks, this.editForm.get('bank')!.value)))
      .subscribe((banks: IBank[]) => (this.banksSharedCollection = banks));
  }

  protected createFromForm(): IAdvisor {
    return {
      ...new Advisor(),
      id: this.editForm.get(['id'])!.value,
      gender: this.editForm.get(['gender'])!.value,
      telephone: this.editForm.get(['telephone'])!.value,
      user: this.editForm.get(['user'])!.value,
      bank: this.editForm.get(['bank'])!.value,
    };
  }
}
