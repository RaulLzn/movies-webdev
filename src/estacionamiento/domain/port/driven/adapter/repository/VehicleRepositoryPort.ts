import Vehicle from "../../../../model/vehicle/Vehicle";

/** 
 * @interface VehicleRepositoryPort
 * @description Interfaz que define los métodos para interactuar con el repositorio de vehículos.
 */
export interface VehicleRepositoryPort {

    /**
     * @method findByPlaca
     * @description Busca un vehículo por su placa en el repositorio.
     * @param {string} placa - La placa del vehículo a buscar.
     * @returns {Promise<Vehicle>} - Promesa que resuelve con el vehículo encontrado o un objeto nulo si no existe.
     */
    findByPlaca(placa: string): Promise<Vehicle>;

    /**
     * @method isStoreClient
     * @description Verifica si un vehículo con la placa dada es cliente de la tienda.
     * @param {string} placa - La placa del vehículo a verificar.
     * @returns {Promise<boolean>} - Promesa que resuelve con true si es cliente de la tienda, false en caso contrario.
     */
    isStoreClient(placa: string): Promise<boolean>;
}