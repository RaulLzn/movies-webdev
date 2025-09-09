/**
 * @interface DailyBalanceInterface
 * @description Interfaz que define la estructura del balance diario del estacionamiento.
 */
export interface DailyBalanceInterface {
    fechaReporte: string;
    recaudoTotalDelDia: number;
    detalleVehiculos: Array<{
        placa: string;
        tipo: string;
        esClienteTienda: boolean;
        montoPagado: number;
    }>;
}
