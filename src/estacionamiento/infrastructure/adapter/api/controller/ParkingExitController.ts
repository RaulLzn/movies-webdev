import { Request, Response } from "express";
import AbstractController from "../../../../../api/domain/model/AbstractController";
import HTTPStatusCode from "../../../../../api/domain/model/HTTPStatusCode";
import ParkingUseCasePort from "../../../../domain/port/driver/usecase/ParkingUseCasePort";

/**
 * @class ParkingExitController
 * @description Controlador que maneja las operaciones de salida de vehículos del estacionamiento.
 * @extends {AbstractController}
 */
export default class ParkingExitController extends AbstractController {
    
    constructor(private parkingUseCase: ParkingUseCasePort) {
        super();
    }

    /**
     * @method processExit
     * @description Maneja las peticiones HTTP para procesar la salida de un vehículo.
     * @param {Request} req - Objeto de petición HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    processExit = async (req: Request, res: Response): Promise<void> => {
        try {
            const { placa } = req.body;
            
            if (!placa) {
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    error: "Placa is required"
                });
                return;
            }

            const register = await this.parkingUseCase.processExit(placa);
            
            if (register.isNull) {
                res.status(HTTPStatusCode.NOT_FOUND).json({
                    error: "No active parking session found for this vehicle"
                });
                return;
            }
            
            res.status(HTTPStatusCode.OK).json({
                placa: register.getVehicle().getPlaca(),
                tipo: register.getVehicle().getTipo(),
                horaIngreso: register.getCheckInTime().toISOString(),
                horaSalida: register.getCheckOutTime()?.toISOString(),
                tiempoEstacionadoMinutos: register.getTimeInMinutes(),
                montoAPagar: register.getTotalPrice()
            });
        } catch (error) {
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : "Internal server error"
            });
        }
    }
}