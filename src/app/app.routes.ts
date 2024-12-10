import { Routes } from '@angular/router';
import { WelcomeComponent } from './Auth/components/welcome/welcome.component';
import { BodyComponent } from './Shared/body/body.component';
import { OperadorComponent } from './Recargas/Componentes/operador/operador.component';
import { RecargaComponent } from './Recargas/Componentes/recarga/recarga.component';
import { VendedorComponent } from './Recargas/Componentes/vendedor/vendedor.component';


export const routes: Routes = [
  { path: '', component: BodyComponent },
  {
    path: '',
    component: BodyComponent,
    //canActivate: [AuthGuard], // Protege rutas detrás del login
    children: [
      { path: 'welcome', component: WelcomeComponent },
      { path: 'operador', component: OperadorComponent },
      { path: 'recarga', component: RecargaComponent },
      { path: 'vendedor', component: VendedorComponent },
    ],
  },


  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
];
