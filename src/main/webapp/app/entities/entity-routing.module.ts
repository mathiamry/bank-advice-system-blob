import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'bank',
        data: { pageTitle: 'bankAdviceSystemApp.bank.home.title' },
        loadChildren: () => import('./bank/bank.module').then(m => m.BankModule),
      },
      {
        path: 'enterprise',
        data: { pageTitle: 'bankAdviceSystemApp.enterprise.home.title' },
        loadChildren: () => import('./enterprise/enterprise.module').then(m => m.EnterpriseModule),
      },
      {
        path: 'advisor',
        data: { pageTitle: 'bankAdviceSystemApp.advisor.home.title' },
        loadChildren: () => import('./advisor/advisor.module').then(m => m.AdvisorModule),
      },
      {
        path: 'manager',
        data: { pageTitle: 'bankAdviceSystemApp.manager.home.title' },
        loadChildren: () => import('./manager/manager.module').then(m => m.ManagerModule),
      },
      {
        path: 'appointment',
        data: { pageTitle: 'bankAdviceSystemApp.appointment.home.title' },
        loadChildren: () => import('./appointment/appointment.module').then(m => m.AppointmentModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
