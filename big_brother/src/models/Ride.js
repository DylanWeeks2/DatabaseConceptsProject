export class Ride {
    constructor(id, pickup_time, dropoff_time, childId, childName, pickupAddr, destAddr, notes, driverId, driverName, child, status) {
        this.id = id;
        this.pickup_time = pickup_time;
        this.dropoff_time = dropoff_time;
        this.childId = childId;
        this.childName = childName;
        this.pickupAddr = pickupAddr;
        this.destAddr = destAddr;
        this.notes = notes;
        this.driverId = driverId;
        this.driverName = driverName;
        this.child = child;
        this.status = status;
    }
}