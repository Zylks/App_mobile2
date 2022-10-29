import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Animation, AnimationController} from '@ionic/angular';
import { Usuario } from 'src/app/model/Usuario';
import { AfterViewInit, ElementRef, OnInit, ViewChild } from '@angular/core';






@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit, AfterViewInit{

  @ViewChild('titulo', { read: ElementRef, static: true}) titulo: ElementRef;
  @ViewChild('desarrolladores', { read: ElementRef, static: true}) desarrolladores: ElementRef;
  
  
  


  
  constructor(
    private activeroute: ActivatedRoute
  , private router: Router
  , private alertController: AlertController
  , private animationController: AnimationController
  , private loadingController: LoadingController) {
    this.router.navigate(['home/inicio']);
 
  }

//---------------------------------------------------
ngOnInit() {
}

segmentChanged($event) {
  this.router.navigate(['home/' + $event.detail.value]);
}



public ngAfterViewInit(): void {
  const animation = this.animationController
    .create()
    .addElement(this.titulo.nativeElement)
    .iterations(Infinity)
    .duration(10000)
    .fromTo('transform', 'translate(-80%)', 'translate(100%)')
    //.fromTo("color", "red", "green")
    
    animation.play();



    const animation3 = this.animationController
    .create()
    .addElement(this.desarrolladores.nativeElement)
    .iterations(Infinity)
    .fill('none')
    .duration(4000)
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '1' },
      { offset: 0.1, transform: 'scale(1.4)', opacity: '0.3' },
      { offset: 0.2, transform: 'scale(1)', opacity: '1' }
    ]);

  animation3.play();
}




}


















