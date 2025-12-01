import { Routes } from '@angular/router';
import { Home as HomeComponent } from './home/home';
import { Profile } from './profile/profile';
import { Login } from './login/login';
import { Register } from './register/register';
import { Contact } from './contact/contact';
import { Detail } from './detail/detail';
import { PropertyForm } from './property-form/property-form';
import { ProfileEdit } from './profile-edit/profile-edit';
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
        path : "profile/edit",
        component : ProfileEdit,
        canActivate: [authGuard],
        title : 'Edit Profile - Griya MDP'
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
        path: "property/add",
        component: PropertyForm,
        canActivate: [authGuard],
        title: 'Tambah Properti - Griya MDP'
    },
    {
        path: "property/edit/:id",
        component: PropertyForm,
        canActivate: [authGuard],
        title: 'Edit Properti - Griya MDP'
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
