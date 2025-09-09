import { VehicleRepositoryPort } from "../../../../domain/port/driven/adapter/repository/VehicleRepositoryPort";
import Vehicle from "../../../../domain/model/vehicle/Vehicle";
import NullVehicle from "../../../../domain/model/vehicle/NullVehicle";
import VehicleLocalDBC from "../../../../../shared/repository/infrastructure/dbc/vehicle/VehicleLocalDBC";

/**
 * @class VehicleRepository
 * @description Implementa el repositorio de vehículos utilizando VehicleLocalDBC.
 * @implements {VehicleRepositoryPort}
 */
export default class VehicleRepository implements VehicleRepositoryPort {
    
    constructor(private vehicleDBC: VehicleLocalDBC) {}

    /**
     * @description Busca un vehículo por su placa.
     * @param placa - placa del vehículo a buscar
     * @returns {Promise<Vehicle>} - Promesa que resuelve con el vehículo encontrado o un NullVehicle si no se encuentra.
     */
    async findByPlaca(placa: string): Promise<Vehicle> {
        const vehicleData = await this.vehicleDBC.findByPlaca(placa);
        
        if (!vehicleData) {
            return new NullVehicle();
        }

        return new Vehicle(vehicleData);
    }

    /**
     * @description Verifica si un vehículo es cliente de la tienda.
     * @param placa - placa del vehículo a verificar
     * @returns {Promise<boolean>} - Promesa que resuelve con true si es cliente, false en caso contrario.
     */
    async isStoreClient(placa: string): Promise<boolean> {
        return await this.vehicleDBC.isStoreClient(placa);
    }
}