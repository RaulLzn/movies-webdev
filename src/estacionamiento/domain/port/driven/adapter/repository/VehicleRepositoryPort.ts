import Vehicle from "../../../../model/vehicle/Vehicle";

/** VehicleRepositoryPort
 * 
 * Interfaz que define los métodos para interactuar con el repositorio de vehículos.
 * Proporciona métodos para buscar vehículos por placa y verificar si un vehículo es cliente de la tienda.
 */
export interface VehicleRepositoryPort {

    findByPlaca(placa: string): Promise<Vehicle>;
    isStoreClient(placa: string): Promise<boolean>;
}