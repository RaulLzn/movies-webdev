import AbstractRouter from "../../../../../api/domain/model/AbstractRouter";
import ParkingEntryController from "../controller/ParkingEntryController";
import ParkingExitController from "../controller/ParkingExitController";
import ParkingReportController from "../controller/ParkingReportController";

export default class ParkingRouter extends AbstractRouter {
    
    constructor(
        private parkingEntryController: ParkingEntryController,
        private parkingExitController: ParkingExitController,
        private parkingReportController: ParkingReportController
    ) {
        super('/api/v1.0/estacionamiento');
        this.routes();
    }

    protected override routes(): void {
        // POST /ingresos
        this.router.post('/ingresos', this.parkingEntryController.register);
        
        // POST /salidas
        this.router.post('/salidas', this.parkingExitController.processExit);
        
        // GET /reportes/balance-diario
        this.router.get('/reportes/balance-diario', this.parkingReportController.getDailyBalance);
    }
}