// src/estacionamiento/infrastructure/adapter/api/factory/ParkingRouterFactory.ts
import { RegisterLocalDBC, VehicleLocalDBC } from "../../../../../shared/Shared";
import ParkingService from "../../../../application/service/ParkingService";
import ParkingUseCase from "../../../../application/usecase/ParkingUseCase";
import RegisterRepository from "../../repository/registerRepository/RegisterRepository";
import VehicleRepository from "../../repository/vehicleRepository/VehicleRepository";
import ParkingEntryController from "../controller/ParkingEntryController";
import ParkingExitController from "../controller/ParkingExitController";
import ParkingReportController from "../controller/ParkingReportController";
import ParkingRouter from "../router/ParkingRouter";

export default class ParkingRouterFactory {
    
    static readonly create = (): ParkingRouter => {
        
        // Crear DBC instances
        const registerLocalDBC = RegisterLocalDBC.getInstance();
        if (!registerLocalDBC) {
            throw new Error('Failed to create RegisterLocalDBC');
        }

        const vehicleLocalDBC = VehicleLocalDBC.getInstance();
        if (!vehicleLocalDBC) {
            throw new Error('Failed to create VehicleLocalDBC');
        }

        // Crear repositorios
        const parkingRepository = new RegisterRepository(registerLocalDBC);
        if (!parkingRepository) {
            throw new Error('Failed to create ParkingRepository');
        }

        const vehicleRepository = new VehicleRepository(vehicleLocalDBC);
        if (!vehicleRepository) {
            throw new Error('Failed to create VehicleRepository');
        }
        
        // Crear servicio
        const parkingService = new ParkingService(parkingRepository, vehicleRepository);
        if (!parkingService) {
            throw new Error('Failed to create ParkingService');
        }
        
        // Crear caso de uso
        const parkingUseCase = new ParkingUseCase(parkingService);
        if (!parkingUseCase) {
            throw new Error('Failed to create ParkingUseCase');
        }
        
        // Crear controladores
        const parkingEntryController = new ParkingEntryController(parkingUseCase);
        if (!parkingEntryController) {
            throw new Error('Failed to create ParkingEntryController');
        }

        const parkingExitController = new ParkingExitController(parkingUseCase);
        if (!parkingExitController) {
            throw new Error('Failed to create ParkingExitController');
        }

        const parkingReportController = new ParkingReportController(parkingUseCase);
        if (!parkingReportController) {
            throw new Error('Failed to create ParkingReportController');
        }
        
        // Crear y retornar router
        const parkingRouter = new ParkingRouter(
            parkingEntryController,
            parkingExitController,
            parkingReportController
        );
        if (!parkingRouter) {
            throw new Error('Failed to create ParkingRouter');
        }

        return parkingRouter;
    }
}