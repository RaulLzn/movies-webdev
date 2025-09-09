// src/estacionamiento/application/usecase/ParkingUseCase.ts
import Register from "../../domain/model/register/Register";
import NullRegister from "../../domain/model/register/NullRegister";
import ParkingUseCasePort from "../../domain/port/driver/usecase/ParkingUseCasePort";
import { ParkingServiceInterface } from "../../domain/interfaces/ParkingServiceInterface";
import { DailyBalanceInterface } from "../../domain/interfaces/DailyBalanceInterface";

export default class ParkingUseCase implements ParkingUseCasePort {
    
    constructor(private readonly parkingService: ParkingServiceInterface) {}

    readonly registerEntry = async (placa: string, tipo: string): Promise<Register> => {
        try {
            if (!placa || placa.trim() === '') {
                return new NullRegister();
            }

            const register = await this.parkingService.registerEntry(placa.trim(), tipo);
            
            return register;
        } catch (error) {
            console.error('Error registering vehicle entry in use case:', error);
            return new NullRegister();
        }
    };

    readonly processExit = async (placa: string): Promise<Register> => {
        try {
            if (!placa || placa.trim() === '') {
                return new NullRegister();
            }

            const register = await this.parkingService.processExit(placa.trim());
            
            return register;
        } catch (error) {
            console.error('Error processing vehicle exit in use case:', error);
            return new NullRegister();
        }
    };

    readonly getDailyBalance = async (fecha: string): Promise<DailyBalanceInterface> => {
        try {
            if (!fecha || fecha.trim() === '') {
                return {
                    fechaReporte: '',
                    recaudoTotalDelDia: 0,
                    detalleVehiculos: []
                };
            }

            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(fecha.trim())) {
                return {
                    fechaReporte: fecha.trim(),
                    recaudoTotalDelDia: 0,
                    detalleVehiculos: []
                };
            }

            const balance = await this.parkingService.getDailyBalance(fecha.trim());
            
            return balance;
        } catch (error) {
            console.error('Error getting daily balance in use case:', error);
            return {
                fechaReporte: fecha || '',
                recaudoTotalDelDia: 0,
                detalleVehiculos: []
            };
        }
    };
}