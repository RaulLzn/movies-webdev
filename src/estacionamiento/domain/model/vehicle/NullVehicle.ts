import Vehicle from "./Vehicle";

/** 
 * @class NullVehicle
 * @description Implementación del patrón Null Object para la clase Vehicle.
 * Representa un vehículo nulo con valores predeterminados.
 * @property {string} placa - La placa del vehículo (valor predeterminado: 'not-found').
 * @property {Type} tipo - El tipo de vehículo (valor predeterminado: 'Not found in database').
 * La propiedad isNull se establece en true para indicar que es un objeto nulo.
 * Sobrescribe los métodos de la clase Vehicle para evitar modificaciones.
 * Lanza errores si se intenta modificar sus propiedades.
 * Hereda todas las propiedades y métodos de la clase Vehicle.
 * Utilizado para evitar valores nulos y manejar casos donde no se encuentra un vehículo.
 */
export default class NullVehicle extends Vehicle {
    constructor() {
        super({
            placa: 'not-found',
            tipo: 'Not found in database'
        });
        this.isNull = true;
    }

    override setPlaca = (_placa: string): void => {
        throw new Error('Cannot set placa on a NullVehicle');
    }

    override setTipo = (_tipo: string): void => {
        throw new Error('Cannot set tipo on a NullVehicle');
    }
}