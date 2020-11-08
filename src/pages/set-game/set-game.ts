import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import * as THREE from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';
window['THREE'] = THREE;
import 'three/examples/js/controls/TransformControls'
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { IGeometry } from '../../components/geometries/IGeometry';
import { GeometryProvider } from '../../providers/geometry/geometry';
import { GeometriesPage } from '../geometries/geometries';

@IonicPage()
@Component({
  selector: 'page-set-game',
  templateUrl: 'set-game.html',
})
export class SetGamePage {

  static colorPickerColumns = 7;

  @ViewChild('svgColorPicker') svgColorPicker: ElementRef;
  @ViewChild('divButton') divButton: ElementRef;
  @ViewChild('divThree') divThree: ElementRef;
  @ViewChild('canvasThree') canvasThree: ElementRef;

  sizeColorPicker 
  colors: Array<String> = [];
  colorsArray
  cloneColorsArray
  rangeFaces
  baricentros

  svgWidth
  svgHeight
  divWidth
  divHeight
  rectsColor = []
  linesColor = []

  scene
  camera
  renderer
  transformControls
  orbitControls
  raycaster
  blockRaycaster = false
  mouse
  vector
  geometry
  material
  mesh
  idAnimation = 0;
  colorPrueba = false;

  color;

  numbersFaceDef = new Array();

  vertices: Array<THREE.Vector3> 
  faces

  selectedColorArray: Array<number> = []
  selectedColorIndex = -1
  colorsFaces = []
  eraserOn = false;

  typeGeometry: string;
  geometryData: IGeometry;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private screenOrientation: ScreenOrientation, private platform: Platform,
    public geometryProvider: GeometryProvider) {

    this.platform = platform;
    platform.ready().then(() => {
      document.addEventListener('backbutton', () => {
            this.goPrincipal()
      }, false);
    });

    if(this.platform.is('cordova')){
      this.platform.ready().then(()=>{
        this.screenOrientation.unlock();
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
      })
    }
    console.log("PLATFORM " + platform.is('cordova'))

    this.typeGeometry = navParams.get('geometry')
    this.sizeColorPicker = navParams.get('sizeColorPicker')
    this.colors = navParams.get('colors')
    this.colorsArray = navParams.get('colorsArray')
    this.rangeFaces = navParams.get('rangeFaces');
    this.cloneColorsArray = new Array(this.colorsArray.length)
    for(var index in this.colorsArray){
      this.cloneColorsArray = this.colorsArray[index]
    }

  }



  initVariables(){
    for(var i = 0; i<this.geometryData.faces.length;i++){
      this.selectedColorArray.push(0);
      this.colorsFaces.push(-1);
    }
  }
  
  init(){
    this.svgWidth = this.svgColorPicker.nativeElement.clientWidth
    this.svgHeight = this.svgColorPicker.nativeElement.clientHeight
    this.divWidth = this.divThree.nativeElement.offsetWidth
    this.divHeight = this.divThree.nativeElement.offsetHeight

    // console.log("INIT " + this.svgWidth + " " + this.svgHeight + " " + this.divWidth + " " + this.divHeight)

  }

  ngAfterViewInit(){

    // window.addEventListener("resize", (e) => {
    //   console.log("RESIZE")
    //   this.init()
    //   this.createColorPicker()
    //   this.colorFacesInit()
    //   this.colorFaces()
    // });
  } 

  ionViewDidLoad() {

    this.geometryProvider.getGeometry(this.typeGeometry)
      .then( geo => {
          console.log("GEOMETRY " + geo.name)
          this.geometryData = geo

          this.vertices = this.arraytoArrayVector3( this.geometryData.vertices );
          this.faces = this.arraytoArrayFace3( this.geometryData.faces );

          this.initVariables()

          this.init()
          this.createColorPicker()
          this.startScene()
          this.createGeometry()
          this.createCamera()
          this.setControls()
          this.rotationAnimate()
          this.colorFacesInit()
          this.colorFaces()
      })

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


  startScene(){

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x9c9c9c );
    var diag = Math.sqrt((this.divHeight*this.divHeight)+(this.divWidth*this.divWidth));
    var FOV = 2 * Math.atan( diag / ( 2 * 1000 ) ) * 180 / Math.PI;
    this.camera = new THREE.PerspectiveCamera( 75, this.divWidth/this.divHeight, 0.1, 1000 );
    
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvasThree.nativeElement});
    this.divThree.nativeElement.appendChild( this.renderer.domElement );


  }

  resizeCanvasToDisplaySize() {
    const canvas = this.renderer.domElement;
    // look up the size the canvas is being displayed
    const width = this.divWidth
    const height = this.divHeight
  
    // adjust displayBuffer size to match
    if (canvas.width !== width || canvas.height !== height) {
      // you must pass false here or three.js sadly fights the browser
      this.renderer.setSize(width, height, false);
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
  
      // update any render target sizes here
    }
  }

  splice(array, value, deleted){
    var index = array.indexOf(value);
    if (index > -1) {
      return array.splice(index, 1);
    }
  }


  createColorPicker(){
    var j = 1;


    var widthSquare = this.svgWidth / 7 * 0.7
    var widthSpace = this.svgWidth / 7 * 0.15

    if( this.typeGeometry == '3') {
      console.log( "SVG W" + this.svgWidth + " H " + this.svgHeight )

      widthSquare = this.svgWidth / 8 * 0.7
      widthSpace = this.svgWidth / 8 * 0.15

    }

    var heightSquare = widthSquare
    var heightSpace = widthSpace

    var x = 5
    var y = x

    console.log("" + this.colors )


    for(var i = 0; i<this.colorsArray.length; i++){

      var fillColor = this.colors[i]
      // var fillColor = '#000000'
      console.log(fillColor)

      this.createColor(x,y,widthSquare,heightSquare,fillColor,this.colorsArray[i],i)

      if(this.typeGeometry != '3'){

        if(j < SetGamePage.colorPickerColumns){
          x += (widthSpace * 2 + widthSquare)
          j++
        } else {
          j = 1
          x = 5
          y += (heightSquare + heightSpace * 2)
        }

      } else {

        if(j < 8){
          x += (widthSpace * 2 + widthSquare)
          j++
        } else {
          j = 1
          x = 5
          y += (heightSquare + heightSpace * 2)
        }

      }


    }
    
    this.createEraser(x, y, widthSquare, heightSquare)
  }

  createEraser(x, y, w, h){

    var rect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
    rect.setAttribute('x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', w);
    rect.setAttributeNS(null, 'height', h);
    rect.setAttributeNS(null, 'fill', 'hsl(0,0%,61%)');
    rect.setAttribute('stroke-width', '1.3%');
    rect.setAttribute('stroke', 'hsl(0,0%,61%)');
    rect.setAttribute('rx', '8')
    rect.setAttribute('ry', '8')

    this.svgColorPicker.nativeElement.appendChild(rect);

    var image = document.createElementNS("http://www.w3.org/2000/svg",'image');
    image.setAttribute('x', x);
    image.setAttributeNS(null, 'y', y);
    image.setAttributeNS(null, 'width', w);
    image.setAttributeNS(null, 'height', h);
    image.setAttribute('href', './assets/imgs/eraser.png')
    image.addEventListener('mousedown', ((event)=>{
      if(this.blockRaycaster){
        this.clearSelectedColor() 
      
      }else {
          //STROKE
          this.clearSelectedColor()
          rect.setAttribute('stroke', 'hsl(0,0%,100%)')
  
          this.clearSelectedColorArray()
          this.selectedColorIndex = -1
          this.eraserOn = true;
        
      } 
  
      }))
    this.svgColorPicker.nativeElement.appendChild(image);
  }

  createColor(x, y, w, h, color, colorArray, indexPalette){

    var rect = document.createElementNS("http://www.w3.org/2000/svg",'rect');
    rect.setAttribute('x', x);
    rect.setAttributeNS(null, 'y', y);
    rect.setAttributeNS(null, 'width', w);
    rect.setAttributeNS(null, 'height', h);
    rect.setAttributeNS(null, 'fill', color);
    rect.setAttribute('stroke-width', '1.3%');
    rect.setAttribute('stroke', 'hsl(0,0%,61%)');
    rect.setAttribute('rx', '8')
    rect.setAttribute('ry', '8')
    rect.addEventListener('mousedown', ((event)=>{
      this.color = colorArray;
      console.log("COLOR PICKED "+color + " " + this.selectedColorArray[indexPalette] + " " + indexPalette)
    if(this.blockRaycaster){
      this.clearSelectedColor()
    
    }else if(this.selectedColorArray[indexPalette]==0){
        //STROKE
        this.clearSelectedColor()
        rect.setAttribute('stroke', 'hsl(0,0%,100%)')

        this.clearSelectedColorArray()
        this.selectedColorArray[indexPalette] = 1
        this.selectedColorIndex = indexPalette
        this.eraserOn = false;
    } 

    }))
    this.svgColorPicker.nativeElement.appendChild(rect);
    this.rectsColor.push(rect)
  
    var line = document.createElementNS("http://www.w3.org/2000/svg",'line');
        line.setAttribute('x1', x);
        line.setAttribute('y1', y);
        line.setAttribute('x2', x+w);
        line.setAttribute('y2', y+h);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('stroke', 'hsl(0,0%,61%)');
        line.setAttribute('visibility', 'hidden')

    var line2 = document.createElementNS("http://www.w3.org/2000/svg",'line');
        line2.setAttribute('x1', x);
        line2.setAttribute('y1', y+h);
        line2.setAttribute('x2', x+w);
        line2.setAttribute('y2', y);
        line2.setAttribute('stroke-width', '2');
        line2.setAttribute('stroke', 'hsl(0,0%,61%)');
        line2.setAttribute('visibility', 'hidden')
        this.svgColorPicker.nativeElement.appendChild(line);
        this.svgColorPicker.nativeElement.appendChild(line2);
        this.linesColor.push([line,line2])

  }

  clearSelectedColorArray(){
    this.selectedColorArray.length = 0;
    for(var i = 0; i<this.geometryData.faces.length;i++){
      this.selectedColorArray.push(0);
    }
  }

  clearSelectedColor(){
    var rects = document.querySelectorAll('rect')
    for(var i = 0; i<rects.length;i++){
      rects[i].setAttribute('stroke', 'hsl(0,0%,61%)')
    }
  }

  isColorInMesh(indexColorsArray){
    ////
    for(var i=0; i<this.colorsFaces.length; i++){
      if(this.colorsFaces[i]==indexColorsArray){
        console.log("IS COLOR MESH " + this.colorsFaces[i] + " " +i)
        return true
      }
    }
    return false

  }

  compareTwoArrays(array1, array2){
    let same = (array1.length === array2.length) && array1.every(function(element, index) {
      console.log("COMPARE two "+ element + " " + array2[index])
      return element === array2[index]; 
    });

    return same
  }
  

  createGeometry(){

    this.geometry = new THREE.Geometry()
    this.geometry.vertices = this.vertices
    this.geometry.faces = this.faces
    this.geometry.center()
    this.material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
    this.mesh.material.vertex = THREE.FaceColors;
    this.mesh.geometry.colorsNeedUpdate = true;
    var edges = new THREE.EdgesGeometry( this.geometry );
    var matEdges = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 1 } );
    var wireframe = new THREE.LineSegments( edges, matEdges );
    wireframe.name = "edges";
    this.mesh.add(wireframe)

    this.scene.add(this.mesh);

  }


  colorFacesInit(){
    var faces = this.geometry.faces.length
    for(var i=0; i<faces; i++){
        this.mesh.geometry.faces[i].color.setHSL(0, 0, 0.61)
        // this.render()
    }
    this.mesh.geometry.colorsNeedUpdate = true
    this.render()
  }

  colorFaces(){
    this.baricentros = this.getBaricentros(this.mesh.geometry)
    var faces = this.rangeFaces
    console.log("FACES "+faces)
    for(var i=0; i<faces; i++){
      var randomFace = Math.floor(Math.random() * (this.geometryData.faces.length - 1));
      // console.log("RANDOM "+randomFace)
      if(this.numbersFaceDef.indexOf(randomFace)==-1){
        this.numbersFaceDef.push(randomFace)
        var colorFace = this.colorsArray[randomFace]
        // colorFace = {h:colorFace[0], s:colorFace[1], l:colorFace[2]}
        console.log("COLOR PALETTE "+ i + " "+colorFace[0]+" "+colorFace[1]+" "+colorFace[2])
        this.mesh.geometry.faces[randomFace].color.setHSL(colorFace[0], colorFace[1], colorFace[2])
        // this.mesh.geometry.faces[randomFace].color.set(colorFace)
        //////
        this.colorsFaces[randomFace]=randomFace

        let hsl = this.mesh.geometry.faces[randomFace].color.getHSL()
        console.log("COLOR FACE x"+ i + " " + Math.round((hsl.h + Number.EPSILON) * 100) / 100 + " " +Math.round((hsl.s + Number.EPSILON) * 100) / 100 + " "+Math.round((hsl.l + Number.EPSILON) * 100) / 100)
        
        this.changeVisibleLines(randomFace, 'visible')

        var faceBaricentro = this.baricentros[randomFace]
        var dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(new THREE.Vector3(faceBaricentro[0], faceBaricentro[1], faceBaricentro[2]))
        var dotMaterial = new THREE.PointsMaterial( { size: 15, sizeAttenuation: false,
        map: this.createCircleTexture('hsl(0,0%,0%)', 256),
        transparent: true,
        depthWrite: false} );
        var dot = new THREE.Points( dotGeometry, dotMaterial );
        this.scene.add( dot );

      } else faces++
      
    }
    this.mesh.geometry.colorsNeedUpdate = true
        this.render()
    this.checkColors()
  }

  createCircleTexture(color, size) {
    var matCanvas = document.createElement('canvas');
    matCanvas.width = matCanvas.height = size;
    var matContext = matCanvas.getContext('2d');
    // create texture object from canvas.
    var texture = new THREE.Texture(matCanvas);
    // Draw a circle
    var center = size / 2;
    matContext.beginPath();
    matContext.arc(center, center, size/2, 0, 2 * Math.PI, false);
    matContext.closePath();
    matContext.fillStyle = color;
    matContext.fill();
    // need to set needsUpdate
    texture.needsUpdate = true;
    // return a texture made from the canvas
    return texture;
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
      // console.log("x"+normal[0]+"y"+normal[1]+" z"+normal[2]);
    }
  
    return normals;
  }

  getMedia(i,j,k){
    return (i+j+k) / 3;
  }

  changeVisibleLines(indexPallette, visibility){
    var lines = this.linesColor[indexPallette]
        lines[0].setAttribute('visibility', visibility)
        lines[1].setAttribute('visibility', visibility)
  }

  checkColors(){
    /////
    for(var i=0; i<this.colorsFaces.length;i++){
      console.log(i + " COLOR FACES " + this.colorsFaces[i])
      if(this.colorsFaces[i]!=i){
        break;
      }
      if(i==this.colorsFaces.length-1){
        console.log("TERMINADO")
          this.divButton.nativeElement.style.visibility = 'visible'
          this.divButton.nativeElement.style.color = 'white';
          this.blockRaycaster = true
          this.clearSelectedColor()
      }
    }
  }

  createCamera(){
    // this.camera.lookAt(this.mesh.position);

    this.camera.updateMatrixWorld();
    var vector = this.camera.position.clone();
    vector.applyMatrix4( this.camera.matrixWorld );
    console.log("CAMERA POSITION " + vector.x + " " + vector.y + " " + vector.z)

    let box = new THREE.Box3().setFromObject(this.mesh);
    let sphere = box.getBoundingSphere()
    let centerPoint = sphere.center;
    this.camera.position.x = 0;
    this.camera.position.y = -200;
    this.camera.position.z = 50;
    this.camera.lookAt(new THREE.Vector3( 0, 0, 50 ));
  }
 
  setControls(){
    
    this.orbitControls = new OrbitControls(this.camera, this.divThree.nativeElement);
    this.orbitControls.addEventListener( 'change', ((event)=>{
      this.render();
    }) );

    document.addEventListener('click', ((event)=>{

      event.preventDefault();
      console.log("CLICK!");
    
      this.mouse = new THREE.Vector2();
      this.mouse.x = ( ( event.clientX - this.renderer.domElement.offsetLeft ) / this.renderer.domElement.width ) * 2 - 1;
      this.mouse.y = - ( ( event.clientY - this.renderer.domElement.offsetTop ) / this.renderer.domElement.height ) * 2 + 1;

      this.raycaster = new THREE.Raycaster();
      this.raycaster.setFromCamera( this.mouse, this.camera )
      var intersects = this.raycaster.intersectObject( this.mesh)

      
      if (intersects.length > 0){
          
          if(intersects[0].point != null && this.color!=null && !this.blockRaycaster){
            // console.log("INTERSECT " + this.color[0] + " " +this.color[1] + " " +this.color[2]);
            console.log("INTERSECT " + intersects[0].faceIndex + " " + this.selectedColorIndex  + " " + this.colorsFaces[intersects[0].faceIndex]);
            //NO COLOREAR DOS VECES CON EL MISMO COLOR
            var draw = true

            //Borrar excluyendo los colores predefinidos
            if(this.eraserOn && this.numbersFaceDef.indexOf(intersects[0].faceIndex)==-1){
            
              let colorFace = this.colorsFaces[intersects[0].faceIndex]
              console.log("COLOR ERASER " + colorFace)
              if( colorFace != -1){
                this.changeVisibleLines(colorFace, 'hidden')
                this.colorsFaces[intersects[0].faceIndex] = -1
                this.mesh.geometry.faces[intersects[0].faceIndex].color.setHSL(0,0,0.61)
                this.mesh.geometry.colorsNeedUpdate = true
                this.render()
              }

            } 
            //Si hay un color seleccionado
            else if(this.selectedColorIndex!=-1){
              
              //Si está coloreado en la figura
              if(this.isColorInMesh(this.selectedColorIndex)){
                //Borrar si se toca el mismo color en la figura, excluyendo los predefinidos
                if(this.selectedColorIndex==this.colorsFaces[intersects[0].faceIndex] && this.numbersFaceDef.indexOf(intersects[0].faceIndex)==-1){
                  this.colorsFaces[intersects[0].faceIndex] = -1
                  this.mesh.geometry.faces[intersects[0].faceIndex].color.setHSL(0,0,0.61)
                  this.mesh.geometry.colorsNeedUpdate = true
                  this.render()
                  this.changeVisibleLines(this.selectedColorIndex, 'hidden')
                }
                draw=false
              }

              //Pintar color, excluyendo los predefinidos
              if(draw && this.numbersFaceDef.indexOf(intersects[0].faceIndex)==-1){
                //////
                var colorFace = this.colorsFaces[intersects[0].faceIndex]
                if(colorFace!=-1){
                  this.changeVisibleLines(this.colorsFaces[intersects[0].faceIndex], 'hidden')
                }
                this.colorsFaces[intersects[0].faceIndex] = this.selectedColorIndex
  
                // var color = 0x00000;
                // switch(intersects[0].faceIndex) {
                // }
                
                // this.mesh.geometry.faces[intersects[0].faceIndex].color.set(this.color);

                this.mesh.geometry.faces[intersects[0].faceIndex].color.setHSL(this.color[0],this.color[1],this.color[2]);
                
                //console.log("COLOR TO CUBE:"+this.color);
                //this.cube.geometry.computeFaceNormals(); 
                this.mesh.geometry.colorsNeedUpdate = true
                //this.cube.geometry.faces[intersects[0].faceIndex].color.setHex(0x00ff00);
                // this.cube.faces[intersects[0].faceIndex].color.setHex(0x00ff00);
                //intersects[0].object.geometry.faces[intersects[0].faceIndex].vertex[0] =new THREE.Color(0x00ff00);
    
                this.render();
    
                this.changeVisibleLines(this.selectedColorIndex, 'visible')
    
                this.checkColors()
  
              }
            }

            
          }
          
        }
    }))

  }

  rotationAnimate() :any {

    this.resizeCanvasToDisplaySize()

    if(this.colorPrueba){

      var geom = this.mesh.geometry.clone();
      this.mesh.updateMatrix();
      geom.applyMatrix(this.mesh.matrix);
      // this.cube.matrix.identity();
      this.mesh.geometry = geom

      //  console.log(this.mesh.geometry.faces[0].normal.x);

      console.log("color prueba " + this.colorPrueba);
      this.colorPrueba = false;

    }


    this.orbitControls.update();
    
    this.render();

    this.idAnimation = requestAnimationFrame(()=>{
      this.rotationAnimate();
    })

  }

  render (): void {
    this.renderer.render(this.scene, this.camera);
  }

  goPrincipal(){
    if(this.platform.is('cordova')){
      this.platform.ready().then(()=>{
        this.screenOrientation.unlock();
      })
    }
    
    this.navCtrl.setRoot(GeometriesPage);
  }

}
