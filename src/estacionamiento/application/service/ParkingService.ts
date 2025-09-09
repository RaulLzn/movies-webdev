// src/estacionamiento/application/service/ParkingService.ts
import { ParkingServiceInterface } from "../../domain/interfaces/ParkingServiceInterface";
import { DailyBalanceInterface } from "../../domain/interfaces/DailyBalanceInterface";
import { ParkingRepositoryPort } from "../../domain/port/driven/adapter/repository/ParkingRepositoryPort";
import { VehicleRepositoryPort } from "../../domain/port/driven/adapter/repository/VehicleRepositoryPort";
import Register from "../../domain/model/register/Register";
import Vehicle from "../../domain/model/vehicle/Vehicle";
import { Type } from "../../domain/model/vehicle/Type";

/**
 * @class ParkingService
 * @description Servicio que implementa la lógica de negocio para el estacionamiento.
 * @implements {ParkingServiceInterface}
 */
export default class ParkingService implements ParkingServiceInterface {
    
    constructor(
        private readonly parkingRepository: ParkingRepositoryPort,
        private readonly vehicleRepository: VehicleRepositoryPort
    ) {}

    /**
     * @method registerEntry
     * @description Registra la entrada de un vehículo al estacionamiento.
     * @param {string} placa - La placa del vehículo que ingresa.
     * @param {string} tipo - El tipo de vehículo (CARRO o MOTO).
     * @returns {Promise<Register>} - Promesa que resuelve con el registro creado.
     * @throws {Error} Si el vehículo ya está estacionado.
     */
    async registerEntry(placa: string, tipo: string): Promise<Register> {
        const existingRegister = await this.parkingRepository.findActiveRegisterByPlaca(placa);
        if (!existingRegister.isNull) {
            throw new Error(`Vehicle with placa ${placa} is already parked`);
        }

        let vehicle = await this.vehicleRepository.findByPlaca(placa);
        if (vehicle.isNull) {
            // Si no existe el vehículo, crear uno nuevo con el tipo especificado
            const vehicleType = tipo === "MOTO" ? Type.MOTO : Type.CARRO;
            vehicle = new Vehicle({
                placa: placa,
                tipo: vehicleType
            });
        }

        const generateUUID = (): string => {
            return 'uuid-park-' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
        };

        const newRegister = new Register({
            registerId: generateUUID(),
            vehicle: {
                placa: vehicle.getPlaca(),
                tipo: vehicle.getTipo()
            },
            checkInTime: new Date(),
            checkOutTime: null,
            timeInMinutes: 0,
            totalPrice: 0
        });

        return await this.parkingRepository.saveRegister(newRegister);
    }

    /**
     * @method processExit
     * @description Procesa la salida de un vehículo del estacionamiento, calculando el tiempo y el monto a pagar.
     * @param {string} placa - La placa del vehículo que sale.
     * @returns {Promise<Register>} - Promesa que resuelve con el registro actualizado.
     * @throws {Error} Si no se encuentra un registro activo para la placa.
     */
    async processExit(placa: string): Promise<Register> {
        const register = await this.parkingRepository.findActiveRegisterByPlaca(placa);
        if (register.isNull) {
            throw new Error(`No active parking session found for placa ${placa}`);
        }

        const checkOutTime = new Date();
        const timeInMinutes = Math.ceil(
            (checkOutTime.getTime() - register.getCheckInTime().getTime()) / (1000 * 60)
        );

        const isStoreClient = await this.vehicleRepository.isStoreClient(placa);
        let totalPrice = 0;

        if (!isStoreClient) {
            const basePrice = register.getVehicle().getTipo() === Type.CARRO ? 88 : 66;
            const subtotal = timeInMinutes * basePrice;
            
            totalPrice = Math.round(subtotal * 1.19);
        }

        register.setCheckOutTime(checkOutTime);
        register.setTimeInMinutes(timeInMinutes);
        register.setTotalPrice(totalPrice);

        return await this.parkingRepository.updateRegister(register);
    }

    /**
     * @method getDailyBalance
     * @description Obtiene el balance diario del estacionamiento para una fecha específica.
     * @param {string} fecha - La fecha para la cual se desea obtener el balance (formato: 'YYYY-MM-DD').
     * @returns {Promise<DailyBalanceInterface>} - Promesa que resuelve con el balance diario.
     */
    async getDailyBalance(fecha: string): Promise<DailyBalanceInterface> {
        const registers = await this.parkingRepository.findRegistersByDate(fecha);
        
        let recaudoTotalDelDia = 0;
        const detalleVehiculos = [];

        for (const register of registers) {
            if (register.getCheckOutTime()) {
                const placa = register.getVehicle().getPlaca();
                const esClienteTienda = await this.vehicleRepository.isStoreClient(placa);
                const montoPagado = register.getTotalPrice();
                
                recaudoTotalDelDia += montoPagado;
                
                detalleVehiculos.push({
                    placa: placa,
                    tipo: register.getVehicle().getTipo(),
                    esClienteTienda: esClienteTienda,
                    montoPagado: montoPagado
                });
            }
        }

        return {
            fechaReporte: fecha,
            recaudoTotalDelDia,
            detalleVehiculos
        };
    }
}