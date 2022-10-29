import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { 
    CapacitorSQLite, SQLiteDBConnection, SQLiteConnection, capSQLiteChanges, 
    CapacitorSQLitePlugin, capSQLiteOptions, DBSQLiteValues
} from '@capacitor-community/sqlite';

import { log, showAlertError } from '../model/Message';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {

  platform: string;
    isNative: boolean = false;
    capacitorSQLitePlugin: CapacitorSQLitePlugin;
    sqlite: SQLiteConnection;
    db: SQLiteDBConnection;
    database: string;
    encrypted: boolean = false;
    mode: string;
    version: number;
    readonly: boolean;
    dbOptions: capSQLiteOptions;
    dbChanges: capSQLiteChanges;
    changes: number;
    isRunning: boolean;
    sqlInsertUser = 'INSERT INTO Usuario (correo, password, nombre, preguntaSecreta, respuestaSecreta, sesionActiva) VALUES (?,?,?,?,?,?)';
    sqlSelectAllUsers = 'SELECT * FROM Usuario';

    constructor() { }
    
    async createUser(correo: string, password: string, nombre: string, preguntaSecreta: string, respuestaSecreta: string, sesionActiva: string): Promise<capSQLiteChanges> {
        return await this.run(this.sqlInsertUser, [correo, password, nombre, preguntaSecreta, respuestaSecreta, sesionActiva]);
    }

    StartSqliteService(createSchema: string, createDatabaseFromScratch: boolean, callee: string): Promise<boolean> {

        this.database = 'asistencia';
        this.encrypted = false;
        this.mode = 'no-encryption';
        this.version = 1;
        this.readonly = false;
        this.dbOptions = {database: this.database, readonly: this.readonly };

        return new Promise(async resolve => {
            try {
                
                log('StartSqliteService', `Iniciar servicio desde ${callee}`);
                log('StartSqliteService', `db:${this.database} enc:${this.encrypted} mode:${this.mode} ver:${this.version} readonly:${this.readonly}`);
                this.platform = Capacitor.getPlatform();
                if(this.platform === 'ios' || this.platform === 'android') this.isNative = true;
                this.capacitorSQLitePlugin = CapacitorSQLite;
                await this.capacitorSQLitePlugin.closeConnection(this.dbOptions).catch((reason) => console.log(reason))
                this.sqlite = new SQLiteConnection(this.capacitorSQLitePlugin);
                this.db = await this.createConnection();
                if (createDatabaseFromScratch) await this.deleteDatabase();
                this.db.open();
                if (createDatabaseFromScratch) {
                    await this.db.execute(createSchema);
                    //Todo: cambia los datos correspondientes a esta wea
                    await this.createUser('atorres@duocuc.cl', '1234', 'Ana Torres Leiva', '¿Cuál es tu animal favorito?', 'gato', 'S');
                    await this.createUser('jperez@duocuc.cl', '5678', 'Juan Pérez González', '¿Cuál es tu postre favorito?', 'panqueques', 'N');
                    await this.createUser('cmujica@duocuc.cl', '0987', 'Carla Mujica Sáez', '¿Cuál es tu vehículo favorito?', 'moto', 'N');
                }
                const rs: DBSQLiteValues = await this.query(this.sqlSelectAllUsers);
                log('StartSqliteService', `Cantidad de usuarios: ${rs.values.length}`);
                rs.values.forEach((value, index) => {
                    log('StartSqliteService', 
                        `Usuario ${index}: ${value.correo}, ${value.password}, ${value.sesionActiva}` 
                        + `${value.nombre}, ${value.preguntaSecreta}, ` 
                        + `${value.respuestaSecreta}, ` 
                        + `${value.sesionActiva}`
                    );
                });
                this.isRunning = true;
                log('StartSqliteService', 'Servicio iniciado');
                resolve(true);
            } catch(err) {
                log('StartSqliteService', 'Servicio no pudo ser iniciado');
                await showAlertError('StartSqliteService', err);
                this.isRunning = false;
                resolve(false);
            }
        });
    }

    getChanges(): number {
        return this.dbChanges.changes.changes;
    }

    async createConnection(): Promise<SQLiteDBConnection> {
        return await this.sqlite.createConnection(this.database, this.encrypted, this.mode, this.version, this.readonly);
    }

    async closeConnection(): Promise<void> {
        return await this.sqlite.closeConnection(this.database, this.readonly);
    }

    async deleteDatabase(): Promise<void> {
        return this.capacitorSQLitePlugin.deleteDatabase(this.dbOptions);
    }

    async execute(query: string): Promise<capSQLiteChanges> {
        this.dbChanges = await this.db.execute(query);
        return this.dbChanges;
    }

    async run(query: string, parameters?: any[]): Promise<capSQLiteChanges> {
        return await this.db.run(query, parameters);
    }

    async query(query: string, parameters?: any[]): Promise<DBSQLiteValues> {
        return await this.db.query(query, parameters);
    }
  
}