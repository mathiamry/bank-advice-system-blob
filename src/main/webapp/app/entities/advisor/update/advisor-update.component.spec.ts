jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AdvisorService } from '../service/advisor.service';
import { IAdvisor, Advisor } from '../advisor.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';

import { AdvisorUpdateComponent } from './advisor-update.component';

describe('Component Tests', () => {
  describe('Advisor Management Update Component', () => {
    let comp: AdvisorUpdateComponent;
    let fixture: ComponentFixture<AdvisorUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let advisorService: AdvisorService;
    let userService: UserService;
    let bankService: BankService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AdvisorUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AdvisorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AdvisorUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      advisorService = TestBed.inject(AdvisorService);
      userService = TestBed.inject(UserService);
      bankService = TestBed.inject(BankService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const advisor: IAdvisor = { id: 456 };
        const user: IUser = { id: 25311 };
        advisor.user = user;

        const userCollection: IUser[] = [{ id: 966 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [user];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ advisor });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Bank query and add missing value', () => {
        const advisor: IAdvisor = { id: 456 };
        const bank: IBank = { id: 91875 };
        advisor.bank = bank;

        const bankCollection: IBank[] = [{ id: 37578 }];
        jest.spyOn(bankService, 'query').mockReturnValue(of(new HttpResponse({ body: bankCollection })));
        const additionalBanks = [bank];
        const expectedCollection: IBank[] = [...additionalBanks, ...bankCollection];
        jest.spyOn(bankService, 'addBankToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ advisor });
        comp.ngOnInit();

        expect(bankService.query).toHaveBeenCalled();
        expect(bankService.addBankToCollectionIfMissing).toHaveBeenCalledWith(bankCollection, ...additionalBanks);
        expect(comp.banksSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const advisor: IAdvisor = { id: 456 };
        const user: IUser = { id: 83882 };
        advisor.user = user;
        const bank: IBank = { id: 70335 };
        advisor.bank = bank;

        activatedRoute.data = of({ advisor });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(advisor));
        expect(comp.usersSharedCollection).toContain(user);
        expect(comp.banksSharedCollection).toContain(bank);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Advisor>>();
        const advisor = { id: 123 };
        jest.spyOn(advisorService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ advisor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: advisor }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(advisorService.update).toHaveBeenCalledWith(advisor);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Advisor>>();
        const advisor = new Advisor();
        jest.spyOn(advisorService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ advisor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: advisor }));
        saveSubject.complete();

        // THEN
        expect(advisorService.create).toHaveBeenCalledWith(advisor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Advisor>>();
        const advisor = { id: 123 };
        jest.spyOn(advisorService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ advisor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(advisorService.update).toHaveBeenCalledWith(advisor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackBankById', () => {
        it('Should return tracked Bank primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBankById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
