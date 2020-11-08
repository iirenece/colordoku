import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IGeometry } from '../../components/geometries/IGeometry';

// import { File } from '@ionic-native/file/ngx';
import { GEOMETRIES } from '../../assets/data/data';
 
export const ICOSAEDRO = "0";
export const TRIAQUISTETRAEDRO = "1";
export const TETRAQUISHEXAEDRO = "2";
export const HEXAQUISOCTAEDRO = "3";

@Injectable()
export class GeometryProvider {

  private dataUrl: string = "./assets/data/data.json"
  geometryList: any;

  constructor(private http: HttpClient, private storage: Storage) {

  }

  initDataDB(){
    this.getDataFromJson()
      .subscribe((res) => {
        
        this.geometryList = res;
        if (this.geometryList != null){
          res.forEach( g => {
            this.storage.set( String(g.id), g);
          })
        }
      })

  
      // GEOMETRIES.forEach( g => {
      //   console.log("GEO " + g.toString());
      //   this.storage.set( String(g.id), g);
      // }
      // );
    
  }

  getGeometry( id: string ){
    return this.storage.get(id)
  }
  
  getDataFromJson(): Observable<IGeometry[]> {
    return this.http.get<IGeometry[]>(this.dataUrl)
  }
  

}
