import { VehicleLocalInterface } from "../../../../../estacionamiento/domain/interfaces/VehicleLocalInterface";
import * as fs from 'fs';
import VehicleLocalProvider from './VehicleLocalProvider';

/**
 * @class VehicleLocalDBC
 * @description Implementación de un DBC (Database Connector) local para la gestión de vehículos con persistencia en archivo.
 * @param vehicle - Objeto que representa un vehículo.
 */
export default class VehicleLocalDBC {
    private static instance: VehicleLocalDBC;
    private readonly provider: VehicleLocalProvider;

    private constructor() {
        this.provider = new VehicleLocalProvider();
    }

    /**
     * @description Obtiene la instancia singleton de VehicleLocalDBC.
     * @returns {VehicleLocalDBC} - Instancia de VehicleLocalDBC.
     */
    static getInstance(): VehicleLocalDBC {
        if (!VehicleLocalDBC.instance) {
            VehicleLocalDBC.instance = new VehicleLocalDBC();
        }
        return VehicleLocalDBC.instance;
    }

    /**
     * @description Lee los vehículos desde el archivo JSON.
     * @returns {Promise<VehicleLocalInterface[]>} - Promesa que resuelve con los datos del archivo.
     */
    private async readVehiclesFile(): Promise<VehicleLocalInterface[]> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.provider.PATH(), 'utf-8', (err, data) => {
                if (err) {
                    // Si el archivo no existe, devolver array vacío
                    if (err.code === 'ENOENT') {
                        resolve([]);
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
     * @description Escribe los vehículos al archivo JSON.
     * @param data - Datos a escribir.
     * @returns {Promise<void>} - Promesa que resuelve cuando se completa la escritura.
     */
    private async writeVehiclesFile(data: VehicleLocalInterface[]): Promise<void> {
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
     * @description Busca un vehículo por su placa. 
     * @param placa - placa del vehículo a buscar
     * @returns {Promise<VehicleLocalInterface | null>} - Promesa que resuelve con el vehículo encontrado o null si no se encuentra.  
    */
    async findByPlaca(placa: string): Promise<VehicleLocalInterface | null> {
        try {
            const vehicles = await this.readVehiclesFile();
            const vehicle = vehicles.find(v => v.placa === placa);
            return vehicle || null;
        } catch (error) {
            throw new Error(`Error finding vehicle by placa: ${error}`);
        }
    }

    /** 
     * @description Verifica si un vehículo es cliente de la tienda. 
     * @param placa - placa del vehículo a verificar
     * @returns {Promise<boolean>} - Promesa que resuelve con true si es cliente, false en caso contrario.
    */
    async isStoreClient(placa: string): Promise<boolean> {
        try {
            // Un vehículo es cliente de la tienda si su placa está registrada en la base de datos de vehículos
            const vehicle = await this.findByPlaca(placa);
            return vehicle !== null;
        } catch (error) {
            console.error(`Error checking if vehicle is store client: ${error}`);
            return false;
        }
    }

    /** 
     * @description Registra un vehículo como cliente de la tienda.
     * @param placa - placa del vehículo a registrar
     * @param tipo - tipo del vehículo (e.g., "CARRO", "MOTO")
    */
    async registerStoreClient(placa: string, tipo: string): Promise<void> {
        try {
            // Verificar si el vehículo ya existe en el archivo
            const vehicles = await this.readVehiclesFile();
            const existingVehicle = vehicles.find(v => v.placa === placa);
            
            if (!existingVehicle) {
                // Si no existe, agregarlo al archivo (esto lo registra como cliente de la tienda)
                vehicles.push({ placa, tipo });
                await this.writeVehiclesFile(vehicles);
            }
            // Si ya existe en el archivo, ya es cliente de la tienda
        } catch (error) {
            throw new Error(`Error registering store client: ${error}`);
        }
    }

    /** 
     * @description Agrega un nuevo vehículo al archivo.
     * @param vehicle - Objeto que representa el vehículo a agregar
     * @returns {Promise<VehicleLocalInterface>} - Promesa que resuelve con el vehículo guardado.
    */
    async saveVehicle(vehicle: VehicleLocalInterface): Promise<VehicleLocalInterface> {
        try {
            const vehicles = await this.readVehiclesFile();
            const existingIndex = vehicles.findIndex(v => v.placa === vehicle.placa);
            
            if (existingIndex !== -1) {
                // Si existe, actualizar
                vehicles[existingIndex] = vehicle;
            } else {
                // Si no existe, agregar
                vehicles.push(vehicle);
            }
            
            await this.writeVehiclesFile(vehicles);
            return vehicle;
        } catch (error) {
            throw new Error(`Error saving vehicle: ${error}`);
        }
    }
}