import Vehicle from "./Vehicle";

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