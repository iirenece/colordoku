import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { GeometriesPageModule } from '../pages/geometries/geometries.module';
import { PalettePageModule } from '../pages/palette/palette.module';
import { SetGamePageModule } from '../pages/set-game/set-game.module';
import { SettingsPageModule } from '../pages/settings/settings.module';
import { GeometryProvider } from '../providers/geometry/geometry';

@NgModule({
  declarations: [
    MyApp,
    // GeometriesPage,
    // SettingsPage,
    // PaletteSeptuagintPage,
    // SetGameTriaquistetraedroPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    GeometriesPageModule,
    PalettePageModule,
    SetGamePageModule,
    SettingsPageModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // GeometriesPage,
    // SettingsPage,
    // PaletteSeptuagintPage,
    // SetGameTriaquistetraedroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GeometryProvider
  ]
})
export class AppModule {}
