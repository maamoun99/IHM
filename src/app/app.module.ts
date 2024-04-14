import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostEditComponent } from './post-edit/post-edit.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { SinglePostComponent } from './single-post/single-post.component';
import { ProfilComponent } from './profil/profil.component';
import { HeaderComponent } from './header/header.component';
import { UserlistComponent } from './userlist/userlist.component';
import { ReservationFormComponent } from './reservation-form/reservation-form.component';
import { DatePipe } from '@angular/common';
import { RegistrationService } from './auth.guard';
import { FooterComponent } from './footer/footer.component';
import { OrderComponent } from './order/order.component';
import { MessageComponent } from './message/message.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AppComponent,
    PostListComponent,
    PostCreateComponent,
    PostEditComponent,
    LoginComponent,
    RegistrationComponent,
    SinglePostComponent,
    ProfilComponent,
    HeaderComponent,
    UserlistComponent,
    ReservationFormComponent,
    FooterComponent,
    OrderComponent,
    MessageComponent,
    CategoryCreateComponent,
    CategoryListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule,
    MatPaginatorModule
  ],
  providers: [
    RegistrationService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
