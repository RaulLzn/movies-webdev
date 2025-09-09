import { RegisterLocalInterface } from "../../../../../estacionamiento/domain/interfaces/RegisterLocalInterface";
import * as fs from 'fs';
import RegisterLocalProvider from './RegisterLocalProvider';

/**
 * @class RegisterLocalDBC
 * @description Implementación de un DBC (Database Connector) local para la gestión de registros de estacionamiento.
 * @param register - Objeto que representa un registro de entrada/salida de un vehículo.
 */
export default class RegisterLocalDBC {
    private static instance: RegisterLocalDBC;
    private readonly provider: RegisterLocalProvider;

    private constructor() {
        this.provider = new RegisterLocalProvider();
    }

    /**
     * @description Obtiene la instancia singleton de RegisterLocalDBC.
     * @returns {RegisterLocalDBC} - Instancia de RegisterLocalDBC.
     */
    static getInstance(): RegisterLocalDBC {
        if (!RegisterLocalDBC.instance) {
            RegisterLocalDBC.instance = new RegisterLocalDBC();
        }
        return RegisterLocalDBC.instance;
    }

    /**
     * @description Lee los registros desde el archivo JSON.
     * @returns {Promise<{registers: RegisterLocalInterface[]}>} - Promesa que resuelve con los datos del archivo.
     */
    private async readRegistersFile(): Promise<{registers: RegisterLocalInterface[]}> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.provider.PATH(), 'utf-8', (err, data) => {
                if (err) {
                    // Si el archivo no existe, devolver estructura vacía
                    if (err.code === 'ENOENT') {
                        resolve({ registers: [] });
                        return;
                    }
                    reject(err);
                    return;
                }
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (parseError) {
                    reject(parseError);
                }
            });
        });
    }

    /**
     * @description Escribe los registros al archivo JSON.
     * @param data - Datos a escribir.
     * @returns {Promise<void>} - Promesa que resuelve cuando se completa la escritura.
     */
    private async writeRegistersFile(data: {registers: RegisterLocalInterface[]}): Promise<void> {
        return new Promise((resolve, reject) => {
            const json = JSON.stringify(data, null, 2);
            fs.writeFile(this.provider.PATH(), json, 'utf-8', (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * @description Convierte las fechas de string a Date en un registro.
     * @param register - Registro con fechas como strings.
     * @returns RegisterLocalInterface - Registro con fechas convertidas a Date.
     */
    private convertDatesFromJSON(register: any): RegisterLocalInterface {
        return {
            ...register,
            checkInTime: new Date(register.checkInTime),
            checkOutTime: register.checkOutTime ? new Date(register.checkOutTime) : null
        };
    }

    /** 
     * @description Guarda un nuevo registro de entrada/salida de un vehículo.
     * @param register - Objeto que representa el registro a guardar.
     * @returns {Promise<RegisterLocalInterface>} - Promesa que resuelve con el registro guardado.
    */
    async saveRegister(register: RegisterLocalInterface): Promise<RegisterLocalInterface> {
        try {
            const data = await this.readRegistersFile();
            data.registers.push(register);
            await this.writeRegistersFile(data);
            return register;
        } catch (error) {
            throw new Error(`Error saving register: ${error}`);
        }
    }

    /** 
     * @description Busca un registro activo (sin hora de salida) por la placa del vehículo.
     * @param placa - placa del vehículo a buscar
     * @returns {Promise<RegisterLocalInterface | null>} - Promesa que resuelve con el registro encontrado o null si no se encuentra.
    */
    async findActiveRegisterByPlaca(placa: string): Promise<RegisterLocalInterface | null> {
        try {
            const data = await this.readRegistersFile();
            const register = data.registers.find(reg => 
                reg.vehicle.placa === placa && !reg.checkOutTime
            );
            return register ? this.convertDatesFromJSON(register) : null;
        } catch (error) {
            throw new Error(`Error finding active register: ${error}`);
        }
    }

    /** 
     * @description Actualiza un registro existente.
     * @param register - Objeto que representa el registro a actualizar.
     * @returns {Promise<RegisterLocalInterface>} - Promesa que resuelve con el registro actualizado.
    */
    async updateRegister(register: RegisterLocalInterface): Promise<RegisterLocalInterface> {
        try {
            const data = await this.readRegistersFile();
            const index = data.registers.findIndex(reg => reg.registerId === register.registerId);
            
            if (index !== -1) {
                data.registers[index] = register;
                await this.writeRegistersFile(data);
                return register;
            } else {
                throw new Error(`Register with ID ${register.registerId} not found`);
            }
        } catch (error) {
            throw new Error(`Error updating register: ${error}`);
        }
    }

    /** 
     * @description Busca todos los registros que coincidan con una fecha específica.
     * @param fecha - fecha en formato ISO (YYYY-MM-DD) para filtrar los registros
     * @returns {Promise<RegisterLocalInterface[]>} - Promesa que resuelve con un array de registros que coinciden con la fecha.
    */
    async findRegistersByDate(fecha: string): Promise<RegisterLocalInterface[]> {
        try {
            const data = await this.readRegistersFile();
            const targetDate = new Date(fecha);
            const results: RegisterLocalInterface[] = [];

            for (const register of data.registers) {
                if (register.checkOutTime) {
                    const checkOutTimeStr = register.checkOutTime.toString();
                    const datePart = checkOutTimeStr.split('T')[0];
                    if (datePart) {
                        const registerDate = new Date(datePart);
                        if (registerDate.getTime() === targetDate.getTime()) {
                            results.push(this.convertDatesFromJSON(register));
                        }
                    }
                }
            }

            return results;
        } catch (error) {
            throw new Error(`Error finding registers by date: ${error}`);
        }
    }
}