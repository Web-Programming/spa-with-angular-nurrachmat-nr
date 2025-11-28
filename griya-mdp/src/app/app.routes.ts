import { Routes } from '@angular/router';
import { Home as HomeComponent } from './home/home';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { Register } from './register/register';
import { Contact } from './contact/contact';
import { Detail } from './detail/detail';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    //mengatuh halaman utama aplikasi
    {
        path : "",
        component : HomeComponent,
        title : 'Home Page'
    },
    {
        path : "profile",
        component : Profile,
        canActivate: [authGuard]
        //title : 'Profile Page'
    },
    {
        path : "login",
        component : Login,
    },
    {
        path : "register",
        component : Register,
    },
    {
        path : "contact",
        component : Contact,
    },
     {
        path: "property/:id",
        component: Detail,
        title: 'Detail Property - Griya MDP'
    },
    {
        path: "**",
        redirectTo: "",
        pathMatch: 'full'
    }
];
