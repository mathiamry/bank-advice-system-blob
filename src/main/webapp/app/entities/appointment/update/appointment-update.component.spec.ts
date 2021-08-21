jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AppointmentService } from '../service/appointment.service';
import { IAppointment, Appointment } from '../appointment.model';
import { IManager } from 'app/entities/manager/manager.model';
import { ManagerService } from 'app/entities/manager/service/manager.service';
import { IAdvisor } from 'app/entities/advisor/advisor.model';
import { AdvisorService } from 'app/entities/advisor/service/advisor.service';

import { AppointmentUpdateComponent } from './appointment-update.component';

describe('Component Tests', () => {
  describe('Appointment Management Update Component', () => {
    let comp: AppointmentUpdateComponent;
    let fixture: ComponentFixture<AppointmentUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let appointmentService: AppointmentService;
    let managerService: ManagerService;
    let advisorService: AdvisorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AppointmentUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AppointmentUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AppointmentUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      appointmentService = TestBed.inject(AppointmentService);
      managerService = TestBed.inject(ManagerService);
      advisorService = TestBed.inject(AdvisorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Manager query and add missing value', () => {
        const appointment: IAppointment = { id: 456 };
        const manager: IManager = { id: 86323 };
        appointment.manager = manager;

        const managerCollection: IManager[] = [{ id: 86198 }];
        jest.spyOn(managerService, 'query').mockReturnValue(of(new HttpResponse({ body: managerCollection })));
        const additionalManagers = [manager];
        const expectedCollection: IManager[] = [...additionalManagers, ...managerCollection];
        jest.spyOn(managerService, 'addManagerToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        expect(managerService.query).toHaveBeenCalled();
        expect(managerService.addManagerToCollectionIfMissing).toHaveBeenCalledWith(managerCollection, ...additionalManagers);
        expect(comp.managersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Advisor query and add missing value', () => {
        const appointment: IAppointment = { id: 456 };
        const advisor: IAdvisor = { id: 74356 };
        appointment.advisor = advisor;

        const advisorCollection: IAdvisor[] = [{ id: 55594 }];
        jest.spyOn(advisorService, 'query').mockReturnValue(of(new HttpResponse({ body: advisorCollection })));
        const additionalAdvisors = [advisor];
        const expectedCollection: IAdvisor[] = [...additionalAdvisors, ...advisorCollection];
        jest.spyOn(advisorService, 'addAdvisorToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        expect(advisorService.query).toHaveBeenCalled();
        expect(advisorService.addAdvisorToCollectionIfMissing).toHaveBeenCalledWith(advisorCollection, ...additionalAdvisors);
        expect(comp.advisorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const appointment: IAppointment = { id: 456 };
        const manager: IManager = { id: 23028 };
        appointment.manager = manager;
        const advisor: IAdvisor = { id: 4599 };
        appointment.advisor = advisor;

        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(appointment));
        expect(comp.managersSharedCollection).toContain(manager);
        expect(comp.advisorsSharedCollection).toContain(advisor);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Appointment>>();
        const appointment = { id: 123 };
        jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appointment }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(appointmentService.update).toHaveBeenCalledWith(appointment);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Appointment>>();
        const appointment = new Appointment();
        jest.spyOn(appointmentService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: appointment }));
        saveSubject.complete();

        // THEN
        expect(appointmentService.create).toHaveBeenCalledWith(appointment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Appointment>>();
        const appointment = { id: 123 };
        jest.spyOn(appointmentService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ appointment });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(appointmentService.update).toHaveBeenCalledWith(appointment);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackManagerById', () => {
        it('Should return tracked Manager primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackManagerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackAdvisorById', () => {
        it('Should return tracked Advisor primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackAdvisorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
