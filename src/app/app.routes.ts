import { Routes } from '@angular/router';

import { ApplicationsList } from './pages/applications-list/applications-list';
import { ApplicationForm } from './pages/application-form/application-form';
import { ApplicationDetail } from './pages/application-detail/application-detail';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'applications' },
  { path: 'applications', component: ApplicationsList },
  { path: 'applications/new', component: ApplicationForm },
  { path: 'applications/:id', component: ApplicationDetail },
  { path: 'applications/:id/edit', component: ApplicationForm },
  { path: '**', redirectTo: 'applications' },
];
