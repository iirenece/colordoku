import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeometriesPage } from './geometries';

@NgModule({
  declarations: [
    GeometriesPage,
  ],
  imports: [
    IonicPageModule.forChild(GeometriesPage),
  ],
})
export class GeometriesPageModule {}
