import { Request, Response } from "express";
import AbstractController from "../../../../../api/domain/model/AbstractController";
import HTTPStatusCode from "../../../../../api/domain/model/HTTPStatusCode";
import ParkingUseCasePort from "../../../../domain/port/driver/usecase/ParkingUseCasePort";

/**
 * @class ParkingReportController
 * @description Controlador que maneja las operaciones de reportes del estacionamiento.
 * @extends {AbstractController}
 */
export default class ParkingReportController extends AbstractController {
    
    constructor(private parkingUseCase: ParkingUseCasePort) {
        super();
    }

    /**
     * @method getDailyBalance
     * @description Maneja las peticiones HTTP para obtener el balance diario del estacionamiento.
     * @param {Request} req - Objeto de petición HTTP.
     * @param {Response} res - Objeto de respuesta HTTP.
     */
    getDailyBalance = async (req: Request, res: Response): Promise<void> => {
        try {
            const { fecha } = req.query;
            
            if (!fecha || typeof fecha !== 'string') {
                res.status(HTTPStatusCode.BAD_REQUEST).json({
                    error: "Fecha query parameter is required (format: YYYY-MM-DD)"
                });
                return;
            }

            const balance = await this.parkingUseCase.getDailyBalance(fecha);
            
            res.status(HTTPStatusCode.OK).json(balance);
        } catch (error) {
            res.status(HTTPStatusCode.INTERNAL_SERVER_ERROR).json({
                error: error instanceof Error ? error.message : "Internal server error"
            });
        }
    }
}