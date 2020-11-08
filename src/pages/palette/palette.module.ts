import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalettePage } from './palette';

@NgModule({
  declarations: [
    PalettePage,
  ],
  imports: [
    IonicPageModule.forChild(PalettePage),
  ],
})
export class PalettePageModule {}
