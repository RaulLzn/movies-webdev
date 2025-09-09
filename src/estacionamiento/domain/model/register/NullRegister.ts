import Register from "./Register";

/** 
 * @class NullRegister
 * @description Implementa el patrón Null Object para la clase Register.
 * @property {string} registerId - Identificador del registro (valor predeterminado: 'not-found').
 * @property {Vehicle} vehicle - Vehículo asociado al registro (valor predeterminado: vehículo nulo).
 * @property {Date} checkInTime - Fecha y hora de entrada (valor predeterminado: 1 de enero de 1970).
 * @property {Date | null} checkOutTime - Fecha y hora de salida (valor predeterminado: null).
 * @property {number} timeInMinutes - Tiempo en minutos (valor predeterminado: 0).
 * @property {number} totalPrice - Precio total (valor predeterminado: 0).
 * Representa un registro nulo que indica que no se encontró un registro válido.
 * Sobrescribe los métodos de la clase Register para evitar modificaciones.
 * Lanza errores si se intenta modificar sus propiedades.
 * Hereda todas las propiedades y métodos de la clase Register.
 * Tiene un identificador fijo 'not-found' y valores predeterminados para sus propiedades.
 * La propiedad isNull se establece en true para indicar que es un objeto nulo.
 * Utilizado para evitar valores nulos y manejar casos donde no se encuentra un registro.
 */
export default class NullRegister extends Register {
    constructor() {
        super({
            vehicle: {
                placa: 'not-found',
                tipo: 'Not found in database'
            },
            registerId: 'not-found',
            checkInTime: new Date(0),
            checkOutTime: null,
            timeInMinutes: 0,
            totalPrice: 0
        });
        this.isNull = true;
    }

    override setRegisterId = (_registerId: string): void => {
        throw new Error('Cannot set registerId on a NullRegister');
    }

    override setVehicle = (_vehicle: any): void => {
        throw new Error('Cannot set vehicle on a NullRegister');
    }

    override setCheckInTime = (_checkInTime: Date): void => {
        throw new Error('Cannot set checkInTime on a NullRegister');
    }

    override setCheckOutTime = (_checkOutTime: Date | null): void => {
        throw new Error('Cannot set checkOutTime on a NullRegister');
    }

    override setTimeInMinutes = (_timeInMinutes: number): void => {
        throw new Error('Cannot set timeInMinutes on a NullRegister');
    }

    override setTotalPrice = (_totalPrice: number): void => {
        throw new Error('Cannot set totalPrice on a NullRegister');
    }
}