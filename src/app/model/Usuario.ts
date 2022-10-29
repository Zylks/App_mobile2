import { DatabaseService } from "../services/database.service";
import { showAlertDUOC } from "./Message";
export class Usuario {
  public correo = '';
  public password = '';
  public nombre = '';
  public preguntaSecreta = '';
  public respuestaSecreta = '';
  public sesionActiva = '';
  
  constructor(
    correo?: string,
    password?: string,
    nombre?: string,
    preguntaSecreta?: string,
    respuestaSecreta?: string)
  {
    this.correo = correo?? '';
    this.password = password?? '';
    this.nombre = nombre?? '';
    this.preguntaSecreta = preguntaSecreta?? '';
    this.respuestaSecreta = respuestaSecreta?? '';
  }

  setUser(correo: string,
    password: string,
    nombre: string,
    preguntaSecreta: string,
    respuestaSecreta: string,
    sesionActiva: string,
    hideSecrets: boolean)
{
    this.correo = correo;
    this.nombre = nombre;
    this.sesionActiva = sesionActiva;
    if (hideSecrets) {
      this.password = '';
      this.preguntaSecreta = '';
      this.respuestaSecreta = '';
    
    } else {
      this.password = password;
      this.preguntaSecreta = preguntaSecreta;
      this.respuestaSecreta = respuestaSecreta;
    }
}

  public listaUsuariosValidos(): Usuario[] {
    const lista = [];
    lista.push(new Usuario('atorres@duocuc.cl', '1234', 'Ana Torres Leiva'
      , '¿Cuál es tu animal favorito?', 'gato'));
    lista.push(new Usuario('avalenzuela@duocuc.cl', 'qwer', 'Alberto Valenzuela Nuñez'
      , '¿Cuál es el nombre de tu mejor amigo?', 'juanito'));
    lista.push(new Usuario('cfuentes@duocuc.cl', 'asdf', 'Carla Fuente Gonzáles'
      , '¿Cuál es el lugar de nacimiento de tu madre?', 'valparaiso'));
    return lista;
  }

  public buscarUsuarioValido(correo: string, password: string): Usuario {
    return this.listaUsuariosValidos().find(
      usu => usu.correo === correo && usu.password === password);
  }

  public validarcorreo(correo?:string): string {
    if (this.correo.trim() === '') {
      return 'Para ingresar al sistema debe ingresar un nombre de usuario.';
    }
    if (this.correo.length < 3 || this.correo.length > 8) {
      return 'El nombre de usuario debe tener entre 3 y 8 caracteres.';
    }
    return '';
  }

  public validarPassword(password?: string): string {
    if (this.password.trim() === '') {
      return 'Para entrar al sistema debe ingresar la contraseña.';
    }
    for(let i = 0; i < this.password.length; i++) {
      if ('0123456789'.indexOf(this.password.charAt(i)) === -1) {
        return 'La contraseña debe ser numérica.';
      }
    }
    if (this.password.length !== 4) {
      return 'La contraseña debe ser numérica de 4 dígitos.';
    }
    return '';
  }

  public validarUsuario() {
    return this.validarcorreo()
      || this.validarPassword();
  }
  async validateUser(correo: string, password: string, db: DatabaseService): Promise<boolean> {
    return new Promise(async (resolve) => {
      let msg = this.validarcorreo(correo);
      if (msg) {
        await showAlertDUOC(msg);
        return Promise.resolve(false);
      }
      msg = this.validarPassword(password);
      if (msg) {
        await showAlertDUOC(msg);
        return Promise.resolve(false);
      }
      const usu = await db.readUser(correo, password, true);
      if (usu === null) {
        await showAlertDUOC('El correo o la contraseña no son correctos');
        return Promise.resolve(null);
      }
      this.correo = usu.correo;
      this.nombre = usu.nombre;
      this.sesionActiva = usu.sesionActiva;
      this.password = usu.password;
      this.preguntaSecreta = usu.preguntaSecreta;
      this.respuestaSecreta = usu.respuestaSecreta;
      return Promise.resolve(usu);
    });
  }
  public buscarUsuarioPorCorreo(correo: string): Usuario {
    return this.listaUsuariosValidos().find(
      usu => usu.correo === correo);
  }

}
