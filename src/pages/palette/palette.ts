import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as THREE from 'three';
import { SetGamePage } from '../set-game/set-game';
import { GeometryProvider } from '../../providers/geometry/geometry';


@IonicPage()
@Component({
  selector: 'page-palette',
  templateUrl: 'palette.html',
})
export class PalettePage {

  @ViewChild('svgColors') svgColorPicker: ElementRef;

  svgWidth
  svgHeight  

  mesh

  centroids = []

  baricentros: Array<THREE.Vector3>;
  rangeFaces;
  verticesTrans;

  colors: Array<string> = [];
  colorsArray: Array<Array<number>> = []

  typeGeometry: string
  geometryData


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public geometryProvider: GeometryProvider, public plt: Platform) {

    this.typeGeometry = navParams.get("geometry")
    this.mesh = navParams.get("mesh")
    this.rangeFaces = navParams.get("rangeFaces")

  }

  ionViewDidLoad() {

    this.geometryProvider.getGeometry(this.typeGeometry)
      .then( geo => {
          console.log("GEOMETRY " + geo.name)
          this.geometryData = geo

          this.init()
          this.calculateBaricentros(this.mesh.geometry)
          this.calculateColors()
          this.createPalette()
      })
    
  }

  init(){
      this.svgWidth = this.svgColorPicker.nativeElement.clientWidth
      this.svgHeight = this.svgColorPicker.nativeElement.clientHeight
  }

  createPalette(){
    let j = 1

    let x = 0
    let xSum = this.svgWidth / 7
    let y = 0
    let ySum = this.svgHeight / 7

    let width = 100 / 7;
    let hegiht = 100 / 7;

    for(var i = 0; i<this.geometryData.faces.length; i++){

      var rect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
      rect.setAttribute('x', x+'');
      rect.setAttribute('y', y+'');
      rect.setAttribute('width', width+'%');
      rect.setAttribute('height', hegiht+'%');
      rect.setAttribute('fill', this.colors[i] );
      rect.setAttribute('stroke-width', '1');
      rect.setAttribute('stroke', 'black');
      
      this.svgColorPicker.nativeElement.appendChild(rect);

      if(j < 7){
        j++
        x += xSum
      } else {
        j = 1
        x = 0
        y += ySum
      }

    }

  }

  calculateBaricentros(geometry: THREE.Geometry){
    var vertices = geometry.vertices;
    var normals: number[][] = [];
  
    var i;
    for(i=0; i<geometry.faces.length ;i++){
      var normal: Array<number>
      var face = geometry.faces[i]
  
      normal = [ this.getMedia(vertices[face.a].x, vertices[face.b].x, vertices[face.c].x), 
                 this.getMedia(vertices[face.a].y, vertices[face.b].y, vertices[face.c].y), 
                 this.getMedia(vertices[face.a].z, vertices[face.b].z, vertices[face.c].z)  ]
  
      normals[i] = normal
      // console.log("x"+normal[0]+"y"+normal[1]+" z"+normal[2]);

      let centroid = new THREE.Vector3( normal[0], normal[1], normal[2])
      this.centroids.push(centroid)
    }
  
    return normals;
  }

  calculateCentroidsSeptuagint(){
    var init = 132
    var exit = 251

    for(var i = init; i<=251; i++){
      let face = this.mesh.geometry.faces[i]

      let centroid = new THREE.Vector3(0,0,0)
      centroid.add(this.mesh.geometry.vertices[face.a])
      // console.log("CENTROIDE A"+i+" "+centroid.x+" "+centroid.y+" "+centroid.z)
      centroid.add(this.mesh.geometry.vertices[face.b])
      // console.log("CENTROIDE B"+i+" "+centroid.x+" "+centroid.y+" "+centroid.z)
      centroid.add(this.mesh.geometry.vertices[face.c])
      // console.log("CENTROIDE C"+i+" "+centroid.x+" "+centroid.y+" "+centroid.z)
      centroid.divideScalar(3)
      // console.log("CENTROIDE "+i+" "+centroid.x+" "+centroid.y+" "+centroid.z)
      this.centroids.push(centroid)
    }
  }

  calculateColors(){

    for(var i = 0; i<this.centroids.length; i++){
      var centroid = this.centroids[i]
     
      var colorHSL = this.getHSLColor(centroid.x, centroid.y, centroid.z)
      var color = 'hsl('+colorHSL[0]*360+','+
      colorHSL[1]*100+'%, '+
      colorHSL[2]*100+'%)'
      this.colors.push(color)
      this.colorsArray.push(colorHSL)
    }

  }

  console(){

    var colorsRect = document.getElementsByClassName('color') as HTMLCollectionOf<HTMLElement>

    for(var i = 0; i<colorsRect.length; i++){
      var baricentro = this.baricentros[i]
     
      var colorHSL = this.getHSLColor(baricentro[0], baricentro[1], baricentro[2])
      var color = "hsl("+colorHSL[0]*360+","+
      colorHSL[1]*100+"%, "+
      colorHSL[2]*100+"%)"
      this.colors.push(color)
      this.colorsArray.push(colorHSL)
      colorsRect.item(i).style.fill = color
    }
  }

  getHColorHSL(x, y, z){
    var alfa = this.degrees( Math.atan( y / x ) )

    if(y>=0 && x<0) alfa =  (180 - Math.abs(alfa))
    else if(y<0 && x<0) alfa =  (180 + Math.abs(alfa))
    else if(y<0 && x>=0) alfa = (360 - Math.abs(alfa))

    return alfa /360
  }
  
  getSColorHSL(x, y, z){
    var auxS = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) )
  
    return (auxS / 100)*2;
  }
  
  getLColorHSL(x, y, z){
    return z / 100;
  }
  
  getHSLColor(x, y, z){
    var h = Number.parseFloat(this.getHColorHSL(x, y ,z).toFixed(2));
    var s = Number.parseFloat(this.getSColorHSL(x, y, z).toFixed(2));
    var l = Number.parseFloat(this.getLColorHSL(x, y, z).toFixed(2));
    var result = [h,s,l]
  
    return result
  }

   // Converts from degrees to radians.
   radians = function(degrees) {
    return degrees * (Math.PI / 180);
  };
   
  // Converts from radians to degrees.
    degrees = function(radians) {
    return radians * (180 / Math.PI);
  };

  getBaricentros(geometry: THREE.Geometry){
    var vertices = geometry.vertices;
    var normals: number[][] = [];
  
    var i;
    for(i=0; i<geometry.faces.length ;i++){
      var normal: Array<number>;
      var face = geometry.faces[i];
  
      normal = [ this.getMedia(vertices[face.a].x, vertices[face.b].x, vertices[face.c].x), 
                 this.getMedia(vertices[face.a].y, vertices[face.b].y, vertices[face.c].y), 
                 this.getMedia(vertices[face.a].z, vertices[face.b].z, vertices[face.c].z)  ];
  
      normals[i] = normal;
  
    }
  
    return normals;
  }

  getMedia(i,j,k){
    return (i+j+k) / 3;
  }

  shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  }

  goSetGame(){

    this.baricentros = []
    for(var i=0;i<this.centroids.length;i++){
      let vertice = [ this.centroids[i].x,
                      this.centroids[i].y,
                      this.centroids[i].z ]
      this.baricentros.push(vertice)
    }

    this.navCtrl.push(SetGamePage, {'sizeColorPicker' : 20, 'colors' : this.colors,
    'colorsArray' : this.colorsArray, 'rangeFaces':this.rangeFaces, 'baricentros':this.baricentros,
    'geometry':this.typeGeometry});
  }
}
