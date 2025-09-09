import NullObject from "../../../../shared/base/domain/interfaces/NullObject";
import { RegisterLocalInterface } from "../../interfaces/RegisterLocalInterface";
import Vehicle from "../vehicle/Vehicle";

/** 
 * @class Register
 * @description Representa un registro de entrada y salida de un vehículo en el estacionamiento.
 * @property {string} registerId - Identificador único del registro.
 * @param {Vehicle} vehicle - Vehículo asociado al registro.
 * @param {Date} checkInTime - Fecha y hora de entrada del vehículo.
 * @param {Date | null} checkOutTime - Fecha y hora de salida del vehículo (puede ser null si no ha salido).
 * @param {number} timeInMinutes - Tiempo total que el vehículo ha estado en el estacionamiento, en minutos.
 * @param {number} totalPrice - Precio total a pagar por el tiempo que el vehículo ha estado en el estacionamiento.
 */
export default class Register implements NullObject {
    private registerId: string
    private vehicle: Vehicle
    private checkInTime: Date
    private checkOutTime: Date | null
    private timeInMinutes: number
    private totalPrice: number
    public isNull: boolean

    
    constructor(register: RegisterLocalInterface) {
        this.registerId = register.registerId || ''
        this.vehicle = new Vehicle(register.vehicle)
        this.checkInTime = register.checkInTime
        this.checkOutTime = register.checkOutTime
        this.timeInMinutes = register.timeInMinutes
        this.totalPrice = register.totalPrice
        this.isNull = false
    }

    getRegisterId = (): string => this.registerId
    
    setRegisterId = (registerId: string): void => {
        this.registerId = registerId
    }

    getVehicle = (): Vehicle => this.vehicle
    
    setVehicle = (vehicle: Vehicle): void => {
        this.vehicle = vehicle
    }

    getCheckInTime = (): Date => this.checkInTime

    setCheckInTime = (checkInTime: Date): void => {
        this.checkInTime = checkInTime
    }

    getCheckOutTime = (): Date | null => this.checkOutTime

    setCheckOutTime = (checkOutTime: Date | null): void => {
        this.checkOutTime = checkOutTime
    }

    getTimeInMinutes = (): number => this.timeInMinutes

    setTimeInMinutes = (timeInMinutes: number): void => {
        this.timeInMinutes = timeInMinutes
    }

    getTotalPrice = (): number => this.totalPrice

    setTotalPrice = (totalPrice: number): void => {
        this.totalPrice = totalPrice
    }
}