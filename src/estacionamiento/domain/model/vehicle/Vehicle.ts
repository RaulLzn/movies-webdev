import NullObject from "../../../../shared/base/domain/interfaces/NullObject";
import { VehicleLocalInterface } from "../../interfaces/VehicleLocalInterface";
import { Type } from "./Type";

/** 
 * @class Vehicle
 * @description Representa un vehículo con su placa y tipo.
 * @property {string} placa - La placa del vehículo.
 * @property {Type} tipo - El tipo de vehículo (Carro, Moto, Camioneta).
 */
export default class Vehicle implements NullObject {
  private placa: string
  private tipo: Type
  public isNull: boolean

    constructor(vehicle: VehicleLocalInterface) {
        this.placa = vehicle.placa
        this.tipo = vehicle.tipo as Type
        this.isNull = false
    }

    getPlaca = (): string => this.placa
    
    setPlaca = (placa: string): void => {
        this.placa = placa
    }

    getTipo = (): Type => this.tipo

    setTipo = (tipo: Type): void => {
        this.tipo = tipo
    }
}