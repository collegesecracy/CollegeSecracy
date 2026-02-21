import mongoose from "mongoose";

const MaintenanceSchema = new mongoose.Schema(
    {
        isMaintenanceMode : 
        {
            type : Boolean,
            required : true,
            default : false
        },
        maintenancePage : 
        {
            type : String,
            required : false,
            default : undefined
        },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
        createdAt: { type: Date, default: Date.now }
    }   
);

const Maintenance = mongoose.model('MaintenanceMode', MaintenanceSchema);
export default Maintenance;