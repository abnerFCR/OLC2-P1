import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ReportesComponent } from './components/reportes/reportes.component';

const routes: Routes = [
 
  {
    path:'reportes',
    component:ReportesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
