// src/estacionamiento/domain/interfaces/ParkingServiceInterface.ts
import Register from "../model/register/Register";

export interface ParkingServiceInterface {
    registerEntry(placa: string): Promise<Register>;
    processExit(placa: string): Promise<Register>;
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