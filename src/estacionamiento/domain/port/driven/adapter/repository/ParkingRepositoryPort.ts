import Register from "../../../../model/register/Register";

/** 
 * @interface ParkingRepositoryPort
 * @description Interfaz que define los métodos para interactuar con el repositorio de registros de estacionamiento.
 * Proporciona métodos para guardar, buscar y actualizar registros.
 */
export interface ParkingRepositoryPort {

    /**
     * @method saveRegister
     * @description Guarda un nuevo registro de entrada de vehículo en el repositorio.
     * @param {Register} register - El registro a guardar.
     * @returns {Promise<Register>} - Promesa que resuelve con el registro guardado.
     */
    saveRegister(register: Register): Promise<Register>;

    /**
     * @method findActiveRegisterByPlaca
     * @description Busca un registro activo (sin hora de salida) por la placa del vehículo.
     * @param {string} placa - La placa del vehículo.
     * @returns {Promise<Register>} - Promesa que resuelve con el registro encontrado o un objeto nulo si no existe.
     */
    findActiveRegisterByPlaca(placa: string): Promise<Register>;

    /**
     * @method updateRegister
     * @description Actualiza un registro existente en el repositorio.
     * @param {Register} register - El registro a actualizar.
     * @returns {Promise<Register>} - Promesa que resuelve con el registro actualizado.
     */
    updateRegister(register: Register): Promise<Register>;

    /**
     * @method findRegistersByDate
     * @description Busca todos los registros de un día específico.
     * @param {string} fecha - La fecha para buscar los registros (formato: 'YYYY-MM-DD').
     * @returns {Promise<Register[]>} - Promesa que resuelve con un arreglo de registros encontrados.
     */
    findRegistersByDate(fecha: string): Promise<Register[]>;
}