import { ParkingRepositoryPort } from "../../../../domain/port/driven/adapter/repository/ParkingRepositoryPort";
import Register from "../../../../domain/model/register/Register";
import NullRegister from "../../../../domain/model/register/NullRegister";
import RegisterLocalDBC from "../../../../../shared/repository/infrastructure/dbc/register/RegisterLocalDBC";

export default class RegisterRepository implements ParkingRepositoryPort {

    constructor(private registerDBC: RegisterLocalDBC) {}

    async saveRegister(register: Register): Promise<Register> {
        const registerData = {
            registerId: register.getRegisterId(),
            vehicle: {
                placa: register.getVehicle().getPlaca(),
                tipo: register.getVehicle().getTipo()
            },
            checkInTime: register.getCheckInTime(),
            checkOutTime: register.getCheckOutTime(),
            timeInMinutes: register.getTimeInMinutes(),
            totalPrice: register.getTotalPrice()
        };

        await this.registerDBC.saveRegister(registerData);
        return register;
    }

    async findActiveRegisterByPlaca(placa: string): Promise<Register> {
        const registerData = await this.registerDBC.findActiveRegisterByPlaca(placa);
        
        if (!registerData) {
            return new NullRegister();
        }

        return new Register(registerData);
    }

    async updateRegister(register: Register): Promise<Register> {
        const registerData = {
            registerId: register.getRegisterId(),
            vehicle: {
                placa: register.getVehicle().getPlaca(),
                tipo: register.getVehicle().getTipo()
            },
            checkInTime: register.getCheckInTime(),
            checkOutTime: register.getCheckOutTime(),
            timeInMinutes: register.getTimeInMinutes(),
            totalPrice: register.getTotalPrice()
        };

        await this.registerDBC.updateRegister(registerData);
        return register;
    }

    async findRegistersByDate(fecha: string): Promise<Register[]> {
        const registersData = await this.registerDBC.findRegistersByDate(fecha);
        
        return registersData.map(data => new Register(data));
    }
}