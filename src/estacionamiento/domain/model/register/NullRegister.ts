import Register from "./Register";

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