import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { capSQLiteChanges } from '@capacitor-community/sqlite';
import { capValueResult } from 'capacitor-data-storage-sqlite';
import { BehaviorSubject } from 'rxjs';
import { log, showAlertError, showToast } from '../model/Message';
import { Usuario } from '../model/Usuario';
import { DatabaseService } from './database.service';
import {DBTaskService} from './dbtask.service'

@Injectable()

export class AuthService {

    authState = new BehaviorSubject(false);
    loginState = new BehaviorSubject(false);


    constructor(
        private router: Router,
        private storage: DBTaskService,
        private db: DatabaseService) 
    { 
        
    }

    async StartAuthService(): Promise<boolean> {
        return await this.storage.StartStorageService('StartAuthenticationService');
    }

    async isLogged(): Promise<boolean> {
        log('isLogged', 'Revisar si el usuario inició sesión')
        return await this.storage.authUserExists().then(autenticado => {
            log('isLogged', autenticado? 'El usuario ha iniciado sesión': 'El usuario no ha iniciado sesión');
            if (autenticado) {
                this.authState.next(true);
            }
            return true;
        });
    }

    isAuthenticated(): Promise<boolean> {
        log('isAuthenticated', 'Iniciar servicio de autenticación')
        this.StartAuthService();
        log('isAuthenticated', 'Revisar si el usuario inició sesión')
        return this.storage.authUserExists().then(autenticado => {
            log('isAuthenticated', autenticado? 'El usuario ha iniciado sesión': 'El usuario no ha iniciado sesión');
            return autenticado;
        });
    }

    async login(correo: string, password: string) {
        console.log('Iniciando login');
        try {
            await this.StartAuthService();
            log('login', `Obteniendo datos del usuario`);
            const data: capValueResult = await this.storage.getItem("USER_DATA");

            if (data !== null) {
                if (data.value !== '') {
                    const usu = JSON.parse(data.value);
                    console.log(`USUARIO ${usu.nombre} HA INICIADO SESION (isLogged)`);
                    this.authState.next(true);
                    this.router.navigate(['home']);
                    return;
                }
            }


            const usu = new Usuario();
            usu.validateUser(correo, password, this.db);
            if (usu === null) {
                console.log('AuthenticationService.login El usuario no fue autenticado');
                return;
            }
            console.log('AuthenticationService.login El usuario fue autenticado');
            const resp = await this.db.updateActiveSession(correo, 'S');
            if (resp.changes.changes === 1) {
                showToast(`¡Bienvenido(a) ${usu.nombre}!`);
                await this.storage.setItem('USER_DATA', JSON.stringify(usu));
                await this.db.logUsers();
                this.authState.next(true);
                this.router.navigate(['home']);
            } else {
                console.log(`No fue posible actualizar la sesión`);
            }
        } catch(err) {
            await showAlertError('AuthenticationService.login', err);
        }
    }

    async logout() {
        console.log('Iniciando logout');
        try {
            const data: capValueResult = await this.storage.getItem('USER_DATA');


            if (data !== null) {
                if (data.value !== '') {
                    const usu = JSON.parse(data.value);
                    const response: capSQLiteChanges = await this.db.updateActiveSession(usu.correo, 'N');
                    if (response.changes.changes === 1) {
                        showToast(`¡Hasta pronto ${usu.nombre}!`);
                        await this.storage.removeItem('USER_DATA');
                        await this.db.logUsers();
                        this.router.navigate(['login']);
                        this.authState.next(false);
                    } else {
                        console.log(`No fue posible actualizar la sesión`);
                    }
                }
            }

        } catch(err) {
            await showAlertError('AuthenticationService.logout', err);
        }
    }

}
