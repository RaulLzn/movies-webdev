import { DailyBalanceInterface } from "../../../interfaces/DailyBalanceInterface";
import Register from "../../../model/register/Register";

/**
 * @interface ParkingUseCasePort
 * @description Interfaz que define los casos de uso para el dominio de estacionamiento.
 */
export default interface ParkingUseCasePort {

    /**
     * @method registerEntry
     * @description Registra la entrada de un vehículo al estacionamiento.
     * @param {string} placa - La placa del vehículo que ingresa.
     * @param {string} tipo - El tipo de vehículo (CARRO o MOTO).
     * @returns {Promise<Register>} - Promesa que resuelve con el registro creado.
     */
    registerEntry: (placa: string, tipo: string) => Promise<Register>;

    /**
     * @method processExit
     * @description Procesa la salida de un vehículo del estacionamiento.
     * @param {string} placa - La placa del vehículo que sale.
     * @returns {Promise<Register>} - Promesa que resuelve con el registro actualizado.
     */
    processExit: (placa: string) => Promise<Register>;

    /**
     * @method getDailyBalance
     * @description Obtiene el balance diario del estacionamiento para una fecha específica.
     * @param {string} fecha - La fecha para la cual se desea obtener el balance (formato: 'YYYY-MM-DD').
     * @returns {Promise<DailyBalanceInterface>} 
     *          - Promesa que resuelve con el balance diario, incluyendo la fecha del reporte, el recaudo total del día y un detalle de los vehículos que ingresaron y salieron.
     */
    getDailyBalance: (fecha: string) => Promise<DailyBalanceInterface>;
}