import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { log } from '../model/Message';
import { AuthService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) { }
  
  async canActivate(): Promise<boolean | UrlTree> {
    
    log('LoginGuardService', 'Ejecutando guardián');
    
    const autenticado = await this.auth.isAuthenticated();

    log('LoginGuardService', autenticado? 'Usuario autenticado navegar a HomePage': 'Usuario no autenticado quedarse en LoginPage');
    
    return autenticado? this.router.parseUrl('/home'): true;

  }
}
