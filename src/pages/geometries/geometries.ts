import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SettingsPage } from '../settings/settings';
import { GeometryProvider, ICOSAEDRO, TRIAQUISTETRAEDRO, TETRAQUISHEXAEDRO, HEXAQUISOCTAEDRO } from '../../providers/geometry/geometry';

@IonicPage()
@Component({
  selector: 'page-geometries',
  templateUrl: 'geometries.html',
})
export class GeometriesPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public platform: Platform, public screenOrientation: ScreenOrientation,
    public geometryProvider: GeometryProvider) {
    
    //ORIENTACIÓN EN MÓVILES
    if(this.platform.is('cordova')){
      this.platform.ready().then(()=>{
        this.screenOrientation.unlock();
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      })
    }

    //INICIACIÓN DB
    this.geometryProvider.initDataDB()

  }

  goIcosahedron(){
    this.navCtrl.push(SettingsPage, {'geometry': ICOSAEDRO })
  }

  goTriaquistetraedro(){
    this.navCtrl.push(SettingsPage, {'geometry': TRIAQUISTETRAEDRO})
  }

  goTetraquishexaedro(){
    this.navCtrl.push(SettingsPage, {'geometry': TETRAQUISHEXAEDRO})
  }

  goHexaquisoctaedro(){
    this.navCtrl.push(SettingsPage, {'geometry': HEXAQUISOCTAEDRO})
  }

}
