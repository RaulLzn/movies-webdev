import { Request, Response } from "express";
import AbstractController from "../../../../../api/domain/model/AbstractController";
import HTTPStatusCode from "../../../../../api/domain/model/HTTPStatusCode";
import ParkingUseCasePort from "../../../../domain/port/driver/usecase/ParkingUseCasePort";

/**
 * @class ParkingEntryController
 * @description Controlador que maneja las operaciones de entrada de vehículos al estacionamiento.
 * @extends {AbstractController}
 */
export default class ParkingEntryController extends AbstractController {
    
    constructor(private parkingUseCase: ParkingUseCasePort) {
        super();
    }

    /**
     * @method register
     * @description Maneja las peticiones HTTP para registrar la entrada de un vehículo.
     * @param {Request} req - Objeto de petición HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { placa, tipo } = req.body;
            
            if (!placa) {
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    error: "Placa is required"
                });
                return;
            }

            // El tipo es opcional, si no se proporciona, se asume CARRO por defecto
            const vehicleType = tipo || "CARRO";
            
            // Validar que el tipo sea válido
            if (vehicleType !== "CARRO" && vehicleType !== "MOTO") {
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    error: "Tipo must be either 'CARRO' or 'MOTO'"
                });
                return;
            }

            const register = await this.parkingUseCase.registerEntry(placa, vehicleType);
            
            if (register.isNull) {
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    error: "Failed to register vehicle entry"
                });
                return;
            }
            
            res.status(HTTPStatusCode.CREATED).json({
                registroId: register.getRegisterId(),
                placa: register.getVehicle().getPlaca(),
                horaIngreso: register.getCheckInTime().toISOString()
            });
        } catch (error) {
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : "Internal server error"
            });
        }
    }
}