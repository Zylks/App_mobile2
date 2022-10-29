import { AlertController, ToastController } from "@ionic/angular";
import { MessageEnum } from "./MessageEnum";

var showLogs: boolean = true;

export function log(source: string, message: string, returnValue?: boolean) {
    if (showLogs) {
        const red = 'color: red;';
        const green = 'color: dark green;';
        const blue = 'color: blue;';
        const black = 'color: blue;';
        const yellow = 'background-color: yellow;';
        const cyan = 'background-color: cyan;';
        const magenta = 'background-color: magenta;';
        let color1 = 'color: gray';
        let color2 = 'color: gray';

        if (source === 'StartSqliteService') { color1 = yellow; color2 = black;}
        if (source === 'DbTaskService')     { color1 = red;    color2 = black;}
        if (source === 'isLogged')           { color1 = blue;   color2 = black;}
        if (source === 'isAuthenticated')    { color1 = green;  color2 = black;}
        if (source === 'LoginGuardService')  { color1 = cyan;   color2 = black;}
        if (source === 'AuthGuardService')   { color1 = magenta;   color2 = black;}

        console.log(`%c${source}:%c ${message}`, color1, color2);
    }
    if (returnValue) return returnValue;
}

export async function showToast(message:string, duration?: number): Promise<void> {
    const controler = new ToastController();
    const toast = await controler.create({ message:message, duration: duration?duration:2000 });
    toast.present();
}

export async function showAlert(header: string, message: string): Promise<void> {
    return new Promise((resolve) => {
        let alert = new AlertController().create({
            header, message, cssClass: 'custom-alert', buttons: [{ text: 'Aceptar', handler: () => resolve() }]
        }).then((value: HTMLIonAlertElement) => value.present());
    });
}

export async function showAlertYesNo(header: string, message: string): Promise<MessageEnum> {
    return new Promise((resolve) => {
        let alert = new AlertController().create({
            header, message, 
            buttons: [
                { text: 'Sí', handler: () => { resolve(MessageEnum.YES); } },
                { text: 'No', handler: () => { resolve(MessageEnum.NO) } },
                { text: 'Cancelar', handler: () => { resolve(MessageEnum.CANCEL) } },
            ]
        }).then((value: HTMLIonAlertElement) => value.present());
    });
}

export async function showAlertDUOC(message: string): Promise<void> {
    return new Promise((resolve) => {
        if (message.trim() === '') resolve();
        let alert = new AlertController().create({
            header: 'App Estoy Presente', message, 
            buttons: [
                { text: 'Aceptar', handler: () => resolve() }
            ]
        }).then((value: HTMLIonAlertElement) => value.present());
    });
}

export async function showAlertYesNoDUOC(message: string): Promise<MessageEnum> {
    return new Promise((resolve) => {
        if (message.trim() === '') resolve(MessageEnum.CANCEL);
        let alert = new AlertController().create({
            header: 'App Estoy Presente', message, 
            buttons: [
                { text: 'Sí', handler: () => { resolve(MessageEnum.YES); } },
                { text: 'No', handler: () => { resolve(MessageEnum.NO) } },
                { text: 'Cancelar', handler: () => { resolve(MessageEnum.CANCEL) } },
            ]
        }).then((value: HTMLIonAlertElement) => value.present());
    });
}

export async function showAlertError(source: string, err: Error): Promise<void> {
    return new Promise((resolve) => {
        const erroMessage = `Error en ${source}. ${err.message}. ` +
            `Comuníquese con el Administrador del Sistema o intente nuevamente más tarde.`;
        if (showLogs) console.log(erroMessage);
        let alert = new AlertController().create({
            header: 'Error del Sistema', message: erroMessage, 
            buttons: [
                { text: 'Aceptar', handler: () => resolve() }
            ]
        }).then((value: HTMLIonAlertElement) => value.present());
    });
}

export async function mostrarEjemplosDeMensajes() {
    await showToast('Este es un mensaje toast');
    await showAlertDUOC('Este es un mensaje alert');
    let response = await showAlertYesNoDUOC('Este es un mensaje de prueba de la función "showAlertYesNoDUOC" ' +
        'que permite escoger entre las alternativas: Sí, No y Cancelar. Escoja una opción.');
    if (response == MessageEnum.YES) await showAlertDUOC('El usuario ha contestado Yes');
    if (response == MessageEnum.NO) await showAlertDUOC('El usuario ha contestado No');
    if (response == MessageEnum.CANCEL) await showAlertDUOC('El usuario ha contestado Cancel');
}