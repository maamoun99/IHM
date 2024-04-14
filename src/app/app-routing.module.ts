import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { ProfilComponent } from './profil/profil.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { OrderComponent } from './order/order.component'; // Import the OrderComponent
import { RoleGuard } from './services/role.guard'; // Import the RoleGuard
import { MessageComponent } from './message/message.component'; // Import the MessageComponent
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'posts', component: PostListComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'posts/create', component: PostCreateComponent, canActivate: [RoleGuard], data: { expectedRole: 'prestateur' } }, // Protect this route with RoleGuard
  { path: 'posts/edit/:id', component: PostEditComponent, canActivate: [RoleGuard], data: { expectedRole: 'prestateur' } }, // Protect this route with RoleGuard
  { path: 'profil', component: ProfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'category/create', component: CategoryCreateComponent },
  { path: 'category', component: CategoryListComponent },
  { path: 'reservation', component: ReservationFormComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'orders', component: OrderComponent }, // Define the route for the OrderComponent
  { path: 'message', component: MessageComponent }, // Define the route for the MessageComponent
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'posts/:id', component: SinglePostComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
