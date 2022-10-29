
import { Component, Input } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Animation, AnimationController} from '@ionic/angular';
import { Usuario } from 'src/app/model/Usuario';
import { AfterViewInit, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { Plugin } from '@capacitor/core';




@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
})
export class InicioComponent implements OnInit,AfterViewInit,OnDestroy{
  
  result = null;
  scanActivate= false;
  escaneando: boolean = false;
  

   



  @ViewChild('bienvenido', { read: ElementRef, static: true}) bienvenido: ElementRef;


  constructor(
    private activeroute: ActivatedRoute
  , private router: Router
  , private alertController: AlertController
  , private animationController: AnimationController
  , private loadingController: LoadingController) {
  }
    


ngAfterViewInit(): void {
  
}

ngOnDestroy(): void {
  
}


public ngOnInit(): void {
     

}


//-------------------------------








async checkPermission() {
  return new Promise(async (resolve) => {
    const status = await BarcodeScanner.checkPermission({ force: true });
    console.log("🚀 ~ file: inicio.component.ts ~ line 71 ~ InicioComponent ~ returnnewPromise ~ status", status)
    
    if (status.granted) {
      resolve(true);
    } else if (status.denied) {
      const alert = await this.alertController.create({
        header: 'no hay permiso',
        message: 'por favor permite el acceso a la camara en tu configuracion',
        buttons: [{
          text: 'No',
          role: 'Cancelar'
        },
        {
          text: 'abrir configuracion',
          handler: () =>{
            BarcodeScanner.openAppSettings();
            resolve(false);

          }
        }
      ]
      })
    }
  });
}

async comenzarEscaneo() {
  const allowed = await this.checkPermission();
  if (allowed) {
    this.escaneando = true;
    BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan({ targetedFormats: [SupportedFormat.QR_CODE] });
    console.log("🚀 ~ file: inicio.component.ts ~ line 101 ~ InicioComponent ~ comenzarEscaneo ~ result", result)
    
    if (result.hasContent) {
      this.result = result.content
      this.escaneando = false;
      alert(result.content);
    } 
    else {
      alert('No fue posible encontrar datos de código QR');
    }
  } 
  else {
    alert('No fue posible escanear, verifique que la aplicación tenga permiso para la cámara');
  }
}

detenerEscaneo() {
  BarcodeScanner.stopScan();
  this.escaneando = false;
}

ionViewWillLeave() {
  this.detenerEscaneo();
}





}
