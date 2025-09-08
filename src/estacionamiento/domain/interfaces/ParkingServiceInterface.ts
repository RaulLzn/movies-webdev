// src/estacionamiento/domain/interfaces/ParkingServiceInterface.ts
import Register from "../model/register/Register";

/**
 * @interface ParkingServiceInterface
 * @description Interfaz que define los métodos para el servicio de estacionamiento.
 */
export interface ParkingServiceInterface {

    /**
     * @method registerEntry
     * @description Registra la entrada de un vehículo al estacionamiento.
     * @param {string} placa - La placa del vehículo que ingresa.
     * @returns {Promise<Register>} - Promesa que resuelve con el registro creado.
     */
    registerEntry(placa: string): Promise<Register>;

    /**
     * @method processExit
     * @description Procesa la salida de un vehículo del estacionamiento.
     * @param {string} placa - La placa del vehículo que sale.
     * @returns {Promise<Register>} - Promesa que resuelve con el registro actualizado.
     */
    processExit(placa: string): Promise<Register>;

    /**
     * @method getDailyBalance
     * @description Obtiene el balance diario del estacionamiento para una fecha específica.
     * @param {string} fecha - La fecha para la cual se desea obtener el balance (formato: 'YYYY-MM-DD').
     * @returns {Promise<{fechaReporte: string; recaudoTotalDelDia: number; detalleVehiculos: Array<{placa: string; tipo: string; esClienteTienda: boolean; montoPagado: number;}>}>} 
     *          - Promesa que resuelve con el balance diario, incluyendo la fecha del reporte, el recaudo total del día y un detalle de los vehículos que ingresaron y salieron.
     */
    getDailyBalance(fecha: string): Promise<{
        fechaReporte: string;
        recaudoTotalDelDia: number;
        detalleVehiculos: Array<{
            placa: string;
            tipo: string;
            esClienteTienda: boolean;
            montoPagado: number;
        }>;
    }>;
}