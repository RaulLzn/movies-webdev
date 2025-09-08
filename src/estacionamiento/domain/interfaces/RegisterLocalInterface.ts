import { VehicleLocalInterface } from "./VehicleLocalInterface";

export interface RegisterLocalInterface {
  registerId: string;
  vehicle: VehicleLocalInterface;
  checkInTime: Date;
  checkOutTime: Date | null;
  timeInMinutes: number;
  totalPrice: number;
}