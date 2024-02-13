import { Routes } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { HomeComponent } from './pages/main/home/home.component';
import { CartComponent } from './pages/main/cart/cart.component';
import { AdminComponent } from './layouts/admin/admin.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';
import { authGuard } from './guards/auth.guard';
import { ProductsComponent } from './pages/admin/products/products.component';
import { ProfileComponent } from './pages/main/profile/profile.component';
import { StoreComponent } from './pages/main/store/store.component';
import { AboutComponent } from './pages/main/about/about.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'store', component: StoreComponent },
      { path: 'about', component: AboutComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'cart', component: CartComponent },
    ]
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    component: AdminComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'products', component: ProductsComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
