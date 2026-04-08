import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { ItemSearchComponent } from './item-search/item-search.component';
import { PrivacySecurityComponent } from './privacy-security/privacy-security.component';
import { HelpComponent } from './help/help.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'inventory', component: InventoryManagementComponent },
  { path: 'search', component: ItemSearchComponent },
  { path: 'privacy', component: PrivacySecurityComponent },
  { path: 'help', component: HelpComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }