import { Component,ViewChild,ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { OBJLoader } from 'three-obj-mtl-loader';
import {  PalettePage } from '../palette/palette'
import { GeometryProvider } from '../../providers/geometry/geometry'
import { IGeometry } from '../../components/geometries/IGeometry';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  //THREE
  @ViewChild('divThree') divThree: ElementRef;
  @ViewChild('canvasThree') canvasThree: ElementRef;
  @ViewChild('divList') divList: ElementRef;

  scene : THREE.Scene;
  camera : THREE.PerspectiveCamera;
  renderer : THREE.WebGLRenderer;
  geometry;
  element;
  material : THREE.MeshBasicMaterial;
  cube : THREE.Mesh;
  raycaster : THREE.Raycaster;
  raycasterPal : THREE.Raycaster;
  mouse : THREE.Vector2;
  vector : THREE.Vector3;
  INTERSECTED : any;
  squares;
  sqGeometry;
  sqMaterial;
  sqObj: Array<THREE.Points>;
  sqSelected: THREE.Points;
  sqGeometry1;
  sqMaterial1;
  color: number;
  rotation: boolean;
  idAnimation = 0;
  lines;
  controls;
  trackControls;

  colorPrueba = false;

  colorBox: THREE.BoxGeometry;
  wireframeBox;

  //RANGES
  rangeScale = 100;
  rangeTranslationX = 0;
  rangeTranslationY = 0;
  rangeTranslationZ = 0;
  rangeFaces;
  rangeZDisabled = false;
  prevScale = new Array(this.scale);
  prevTransX = new Array(this.rangeTranslationX);
  prevTransY = new Array(this.rangeTranslationY);
  prevTransZ = new Array(this.rangeTranslationZ);

  minTranslationX = -50;
  maxTranslationX = 50;
  spaceTranslationX = 100;
  minTranslationY = -50;
  maxTranslationY = 50;
  spaceTranslationY = 100;
  minTranslationZ = 0;
  maxTranslationZ = 100;
  spaceTranslationZ = 100;
  minFaces = 5;
  maxFaces = 20;

  indexLowerX = -1
  indexLowerOriX = -1
  indexUpperX = -1
  indexUpperOriX = -1
  indexLowerY = -1
  indexLowerOriY = -1
  indexUpperY = -1
  indexUpperOriY = -1
  indexLowerZ = -1
  indexLowerOriZ = -1
  indexUpperZ = -1
  indexUpperOriZ = -1
  
  verticesOri: Array<THREE.Vector3>  
  verticesTrans: Array<THREE.Vector3>;
  verticesOriScaled: Array<THREE.Vector3>;

  faces

  typeGeometry: string
  geometryData: IGeometry

  minRange;
  maxRange;


  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public geometryProvider: GeometryProvider, public platform: Platform) {
    
    this.typeGeometry = navParams.get('geometry')

  }

  ionViewDidLoad() {
    if(! this.platform.is('cordova')){
      this.divThree.nativeElement.style.width = '50%';
      this.divThree.nativeElement.style.height = '100%';

      this.canvasThree.nativeElement.style.width = '100%';
      this.canvasThree.nativeElement.style.height = '100%';

      this.divList.nativeElement.style.width = '50%';
      this.divList.nativeElement.style.height = '100%';
    }

    this.geometryProvider.getGeometry(this.typeGeometry)
      .then( geo => {
          console.log("GEOMETRY " + geo.name)
          this.geometryData = geo

          this.minRange = this.geometryData.minRange
          this.maxRange = this.geometryData.maxRange
          this.rangeFaces = this.minRange

          this.verticesOri = this.arraytoArrayVector3( this.geometryData.vertices )
          this.faces = this.arraytoArrayFace3( this.geometryData.faces )

          this.verticesTrans = this.cloneArrayVector3(this.verticesOri)
          this.verticesOriScaled = this.cloneArrayVector3(this.verticesOri)

          this.init();
          this.rotationAnimate();
      })

  }

  watchRangeScale(){
    this.scale(this.rangeScale)
  }
  watchRangeTranslationX(){
    this.translationX(this.rangeTranslationX)
  }
  watchRangeTranslationY(){
    this.translationY(this.rangeTranslationY)
  }

  watchRangeTranslationZ(){
    this.translationZ(this.rangeTranslationZ)
  }

  translationX(value){
  
    var spaceFillX = this.spaceX();
    var spaceEnable = this.spaceTranslationX - spaceFillX
    var rangeX = value * spaceEnable / 100

    var verticesAux = this.cloneArrayVector3(this.verticesTrans)
    for (var index in verticesAux){
      verticesAux[index].x = this.verticesOriScaled[index].x + rangeX;
      console.log(verticesAux[index].x);
    }
    this.verticesTrans = this.cloneArrayVector3(verticesAux)

  
    this.cube.geometry.vertices=this.verticesTrans;
    var geom = this.cube.geometry.clone();
    this.cube.updateMatrix();
    geom.applyMatrix(this.cube.matrix);
    this.cube.geometry = geom
    this.updateEdges();
  }

  translationY(value){

    var spaceFillY = this.spaceY();
    var spaceEnable = this.spaceTranslationY - spaceFillY
    var rangeY = value * spaceEnable / 100

    var verticesAux = this.cloneArrayVector3(this.verticesTrans)
    for (var index in verticesAux){
      verticesAux[index].y = this.verticesOriScaled[index].y + rangeY;
      console.log(verticesAux[index].y);
    }
    this.verticesTrans = this.cloneArrayVector3(verticesAux)

    this.cube.geometry.vertices=this.verticesTrans;
    var geom = this.cube.geometry.clone();
    this.cube.updateMatrix();
    geom.applyMatrix(this.cube.matrix);
    this.cube.geometry = geom
    this.updateEdges();
  }

  translationZ(value){

    var spaceFillZ = this.spaceZ();
    var spaceEnable = this.spaceTranslationZ - spaceFillZ
    var rangeZ = value * spaceEnable / 100

    var verticesAux = this.cloneArrayVector3(this.verticesTrans)
    for (var index in verticesAux){
      verticesAux[index].z = this.verticesOriScaled[index].z + rangeZ;
      console.log(verticesAux[index].z);
      this.verticesTrans = this.cloneArrayVector3(verticesAux)
    }

  this.cube.geometry.vertices=this.verticesTrans;
  var geom = this.cube.geometry.clone();
  this.cube.updateMatrix();
  geom.applyMatrix(this.cube.matrix);
  this.cube.geometry = geom
  this.updateEdges();
  }


  scale(value){

    var verticesAux = this.cloneArrayVector3(this.verticesOri);
    var scaleFactor = value / 100;
    for(var i=0; i<verticesAux.length; i++){
      this.verticesTrans[i] = verticesAux[i].multiplyScalar(scaleFactor)
    }
    this.translateToOrigin()
    this.verticesOriScaled = this.cloneArrayVector3(this.verticesTrans);

    var vector = this.geometry.vertices[0];

    this.rangeTranslationX = 0;
    this.rangeTranslationY = 0;
    this.rangeTranslationZ = 0;

    if(this.checkSpaceZ()==0){
      this.rangeZDisabled = true;
    } else this.rangeZDisabled = false;

    this.cube.geometry.vertices=this.verticesTrans;
    var geom = this.cube.geometry.clone();
    this.cube.updateMatrix();
    geom.applyMatrix(this.cube.matrix);
    this.cube.geometry = geom
    this.updateEdges();
    
    
  }

  updateEdges(){
    this.cube.remove(this.cube.getObjectByName("edges"));

    var edges = new THREE.EdgesGeometry( this.cube.geometry );
    var matEdges = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 5 } );
    var wireframe = new THREE.LineSegments( edges, matEdges );
    wireframe.name = "edges"
    this.cube.add(wireframe)
  }

  checkSpaceZ(){
    var spaceFillZ = this.spaceZ();
    var spaceEnable = this.spaceTranslationZ - spaceFillZ
    return spaceEnable
  }

  translateToOrigin(){
    var verticesAux = this.cloneArrayVector3(this.verticesTrans);
    
    var spaceX = Math.abs(this.lowerOriX() - this.lowerX())
    var spaceY = Math.abs(this.upperOriY() - this.upperY())
    var spaceZ = Math.abs(this.lowerOriZ() - this.lowerZ())

    for(var i in verticesAux){
      verticesAux[i].x = verticesAux[i].x - spaceX
      verticesAux[i].y = verticesAux[i].y - spaceY
      verticesAux[i].z = verticesAux[i].z - spaceZ
    }

    this.verticesTrans = this.cloneArrayVector3(verticesAux)

    this.cube.geometry.vertices=this.verticesTrans;
    var geom = this.cube.geometry.clone();
    this.cube.updateMatrix();
    geom.applyMatrix(this.cube.matrix);
    this.cube.geometry = geom

  }

  lowerX(){
    if(this.indexLowerX == -1){
      let index = 0
      let value = this.verticesTrans[0].x
      for(var i=1; i<this.verticesTrans.length; i++){
        if(this.verticesTrans[i].x<value){ 
          value = this.verticesTrans[i].x
          index = i
        }
      }
      this.indexLowerX = index
    }
    return this.verticesTrans[this.indexLowerX].x
  }
  
  upperX(){
    if(this.indexUpperX == -1){
      let index = 0
      let value = this.verticesTrans[0].x
      for(var i=1; i<this.verticesTrans.length; i++){
        if(this.verticesTrans[i].x>value){ 
          value = this.verticesTrans[i].x
          index = i
        }
      }
      this.indexUpperX = index
    }
    return this.verticesTrans[this.indexUpperX].x
  }

  lowerOriX(){
    if(this.indexLowerOriX == -1){
      let index = 0
      let value = this.verticesOri[0].x
      for(var i=1; i<this.verticesOri.length; i++){
        if(this.verticesOri[i].x<value){ 
          value = this.verticesOri[i].x
          index = i
        }
      }
      this.indexLowerOriX = index
    }
    return this.verticesOri[this.indexLowerOriX].x
  }
  
  upperOriX(){
    if(this.indexUpperOriX == -1){
      let index = 0
      let value = this.verticesOri[0].x
      for(var i=1; i<this.verticesOri.length; i++){
        if(this.verticesOri[i].x>value){ 
          value = this.verticesOri[i].x
          index = i
        }
      }
      this.indexUpperOriX = index
    }
    return this.verticesTrans[this.indexUpperOriX].x
  }

  lowerY(){
    if(this.indexLowerY == -1){
      let index = 0
      let value = this.verticesTrans[0].y
      for(var i=1; i<this.verticesTrans.length; i++){
        if(this.verticesTrans[i].y<value){ 
          value = this.verticesTrans[i].y
          index = i
        }
      }
      this.indexLowerY = index
    }
    return this.verticesTrans[this.indexLowerY].y
  }

  upperY(){
    if(this.indexUpperY == -1){
      let index = 0
      let value = this.verticesTrans[0].y
      for(var i=1; i<this.verticesTrans.length; i++){
        if(this.verticesTrans[i].y>value){ 
          value = this.verticesTrans[i].y
          index = i
        }
      }
      this.indexUpperY = index
    }
    return this.verticesTrans[this.indexUpperY].y
  }

  lowerOriY(){
    if(this.indexLowerOriY == -1){
      let index = 0
      let value = this.verticesOri[0].y
      for(var i=1; i<this.verticesOri.length; i++){
        if(this.verticesOri[i].y<value){ 
          value = this.verticesOri[i].y
          index = i
        }
      }
      this.indexLowerOriY = index
    }
    return this.verticesOri[this.indexLowerOriY].y
  }

  upperOriY(){
    if(this.indexUpperOriY == -1){
      let index = 0
      let value = this.verticesOri[0].y
      for(var i=1; i<this.verticesOri.length; i++){
        if(this.verticesOri[i].y>value){ 
          value = this.verticesOri[i].y
          index = i
        }
      }
      this.indexUpperOriY = index
      console.log("UPPER O Y " + value)
    }
    return this.verticesOri[this.indexUpperOriY].y
  }

  lowerZ(){
    if(this.indexLowerZ == -1){
      let index = 0
      let value = this.verticesTrans[0].z
      for(var i=1; i<this.verticesTrans.length; i++){
        if(this.verticesTrans[i].z<value){ 
          value = this.verticesTrans[i].z
          index = i
        }
      }
      this.indexLowerZ = index
    }
    return this.verticesTrans[this.indexLowerZ].z
  }

  upperZ(){
    if(this.indexUpperZ == -1){
      let index = 0
      let value = this.verticesTrans[0].z
      for(var i=1; i<this.verticesTrans.length; i++){
        if(this.verticesTrans[i].z>value){ 
          value = this.verticesTrans[i].z
          index = i
        }
      }
      this.indexUpperZ = index
    }
    return this.verticesTrans[this.indexUpperZ].z
  }

  lowerOriZ(){
    if(this.indexLowerOriZ == -1){
      let index = 0
      let value = this.verticesOri[0].z
      for(var i=1; i<this.verticesOri.length; i++){
        if(this.verticesOri[i].z<value){ 
          value = this.verticesOri[i].z
          index = i
        }
      }
      this.indexLowerOriZ = index
    }
    return this.verticesOri[this.indexLowerOriZ].z
  }

  upperOriZ(){
    if(this.indexUpperZ == -1){
      let index = 0
      let value = this.verticesOri[0].z
      for(var i=1; i<this.verticesOri.length; i++){
        if(this.verticesOri[i].z>value){ 
          value = this.verticesOri[i].z
          index = i
        }
      }
      this.indexUpperZ = index
    }
    return this.verticesOri[this.indexUpperZ].z
  }


  spaceX(){
    var xMin = this.lowerX()
    var xMax = this.upperX()
    return Math.abs(xMin - xMax)
  }

  spaceY(){
    var yMin = this.lowerY()
    var yMax = this.upperY()
    return Math.abs(yMin - yMax)
  }

  spaceZ(){
    var zMin = this.lowerZ()
    var zMax = this.upperZ()
    return Math.abs(zMin - zMax)
  }

  init(){

    this.element	= this.divThree.nativeElement;

    var width = this.canvasThree.nativeElement.width;
    var height = this.canvasThree.nativeElement.height;

    var widthCanvas = width;
    var heightCanvas = height;

    this.scene = new THREE.Scene();
    var diag = Math.sqrt((height*height)+(width*width));
    var FOV = 2 * Math.atan( diag / ( 2 * 1000 ) ) * 180 / Math.PI;
    console.log("fov"+FOV);
    this.camera = new THREE.PerspectiveCamera( 75, widthCanvas/heightCanvas, 0.1, 1000 );
  
    // this.camera.up.set(0,0,1);
    this.renderer = new THREE.WebGLRenderer({canvas: document.querySelector("canvas")});
    // this.renderer = new THREE.WebGLRenderer();
    // this.renderer.setSize( widthCanvas, heightCanvas );
    this.element.appendChild( this.renderer.domElement );

    //CUBO ESPACIO COLOR
    this.colorBox = new THREE.BoxGeometry(100, 100, 100, 0, 0, 0);
    this.colorBox.translate(0,0,50)

    var edges = new THREE.EdgesGeometry( this.colorBox );
    var matEdges = new THREE.LineBasicMaterial( { color: 0x6D0394, linewidth: 2 } );
    this.wireframeBox = new THREE.LineSegments( edges, matEdges );
    this.scene.add( this.wireframeBox );

    this.geometry = new THREE.Geometry();
  
    this.geometry.vertices = this.verticesOri;
    this.geometry.faces = this.faces;
  
    this.material = new THREE.MeshBasicMaterial( { color: 0x00000 } );
    this.cube = new THREE.Mesh( this.geometry, this.material );

    var edges = new THREE.EdgesGeometry( this.geometry );
    var matEdges = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 } );
    var wireframe = new THREE.LineSegments( edges, matEdges );
    wireframe.name = "edges";
    this.cube.add(wireframe)

    this.scene.add(this.cube);

    var geometry = new THREE.CylinderGeometry( 50, 50, 100, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var cylinder = new THREE.Mesh( geometry, material );
    console.log("CYLINDER "+cylinder.geometry.vertices[0].x)


   this.resizeCanvasToDisplaySize();
  
    let box = new THREE.Box3().setFromObject(this.wireframeBox);
    let sphere = box.getBoundingSphere()
    let centerPoint = sphere.center;
    this.camera.position.x = 0;
    this.camera.position.y = -300;
    this.camera.position.z = 50;
    this.camera.lookAt(centerPoint);
    // this.camera.position.y = 3;

    this.raycaster = new THREE.Raycaster();

    this.mouse = new THREE.Vector2();
    this.vector = new THREE.Vector3();

    this.cube.material.vertexColors = THREE.FaceColors;
    this.cube.geometry.colorsNeedUpdate = true;

    console.log("Init DONE");

    this.controls = new OrbitControls(this.camera, this.element);
    this.controls.addEventListener( 'change', ((event)=>{
      this.render();
    }) );
  }

  render (): void {
    this.renderer.render(this.scene, this.camera);
  }

  resizeCanvasToDisplaySize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== width ||canvas.height !== height) {
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }
  }

  rotationAnimate() :any {

    if(this.colorPrueba){

      var geom = this.cube.geometry.clone();
      this.cube.updateMatrix();
      geom.applyMatrix(this.cube.matrix);
      // this.cube.matrix.identity();
      this.cube.geometry = geom

      var baricentros = this.getBaricentros(this.cube.geometry);
      var size = this.cube.geometry.faces.length;
      for(var i=0; i<size; i++){
        var baricentro = baricentros[i];
        var color = this.getHSLColor(baricentro[0], baricentro[1], baricentro[2]);
        this.cube.geometry.faces[i].color.setHSL(color[0], color[1], color[2]);
      }

      this.colorPrueba = false;
    }

    this.controls.update();
    
    this.render();

    this.idAnimation = requestAnimationFrame(()=>{
      this.rotationAnimate();
    })

  }

  getBaricentros(geometry: THREE.Geometry){
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
      console.log("x"+normal[0]+"y"+normal[1]+" z"+normal[2]);
    }
  
    return normals;
  }

  getNormals(geometry: THREE.Geometry){
    this.geometry.computeFaceNormals();
    var vertices = geometry.vertices;
    var normals: number[][] = [];
  
    var i;
    for(i=0; i<geometry.faces.length ;i++){
      var normal: Array<number>
      var face = geometry.faces[i]
      console.log("NORMAL " + face.normal.x)
      var verticeA = vertices[face.a]
      var verticeB = vertices[face.b]
      var verticeC = vertices[face.c]
      
      var sideV = verticeB.sub(verticeA)
      var sideW = verticeC.sub(verticeA)

      normal = sideV.cross(sideW)
      normals[i] = normal
    }
  
    return normals;
  }

  getMedia(i,j,k){
    return (i+j+k) / 3;
  }

  getHColorHSL(x, y, z){
    var alfa = this.degrees( Math.atan( y / x ) )
    console.log("DREGREES H COLOR " + alfa);

    return alfa
  }
  
  getSColorHSL(x, y, z){
    var auxS = Math.sqrt( Math.pow(x, 2) + Math.pow(y, 2) )
  
    return auxS / 100;

  }
  
  getLColorHSL(x, y, z){
    return z / 100;
  }
  
  getHSLColor(x, y, z){
    var h = this.getHColorHSL(x, y ,z);
    var s = this.getSColorHSL(x, y, z);
    var l = this.getLColorHSL(x, y, z);
    var result: number[] = [h,s,l]
  
    return result
  }

   // Converts from degrees to radians.
   radians = function(degrees) {
    return degrees * Math.PI / 180;
  };
   
  // Converts from radians to degrees.
    degrees = function(radians) {
    return radians * 180 / Math.PI;
  };

  cloneArrayVector3(array: Array<THREE.Vector3>){
    var arrayAux = new Array<THREE.Vector3>(array.length)
    for(var index in array){
      var vector = array[index].clone()
      arrayAux[index] = vector

    }
    return arrayAux
  }

  arraytoArrayVector3(array){
    var arrayAux = new Array<THREE.Vector3>(array.length)
    for(var index in array){
      var vector = array[index]
      arrayAux[index] = new THREE.Vector3(vector[0], vector[1], vector[2]);
    }
    return arrayAux
  }

  arraytoArrayFace3(array){
    var arrayAux = new Array<THREE.Face3>(array.length)
    for(var index in array){
      var vector = array[index]
      arrayAux[index] = new THREE.Face3(vector[0], vector[1], vector[2]);
    }
    return arrayAux
  }

  goPalette(){

    this.navCtrl.push(PalettePage, { 'geometry':this.typeGeometry, 'mesh':this.cube,
      'rangeFaces': this.rangeFaces });
  }

}