import { VehicleLocalInterface } from "./VehicleLocalInterface";

/** 
 * @interface RegisterLocalInterface
 * @description Interfaz que representa la estructura local de un registro de entrada y salida de un vehículo en el estacionamiento.
 * @property {string} registerId - Identificador único del registro.
 * @property {VehicleLocalInterface} vehicle - Vehículo asociado al registro.
 * @property {Date} checkInTime - Fecha y hora de entrada del vehículo.
 * @property {Date | null} checkOutTime - Fecha y hora de salida del vehículo (puede ser null si no ha salido).
 * @property {number} timeInMinutes - Tiempo total que el vehículo ha estado en el estacionamiento, en minutos.
 * @property {number} totalPrice - Precio total a pagar por el tiempo que el vehículo ha estado en el estacionamiento.
 */
export interface RegisterLocalInterface {
  registerId: string;
  vehicle: VehicleLocalInterface;
  checkInTime: Date;
  checkOutTime: Date | null;
  timeInMinutes: number;
  totalPrice: number;
}