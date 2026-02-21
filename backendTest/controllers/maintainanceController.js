import Maintenance from "../models/MaintenanceSchema.js"

export const EnableMaintenance = async(req, res) =>
{
    const { maintenancePage } = req.body;
        
    const maintenanceDoc = await Maintenance.create({
        isMaintenanceMode : true,
        maintenancePage : maintenancePage,
         createdBy: req.user.id 
    });

    res.status(200).json({
        success : true,
        message : "Maintenance Mode Enabled !",
        maintenanceDoc : maintenanceDoc
    })

}

export const checkMaintenance = async (req, res) => {
    try {
        const maintenance = await Maintenance.findOne({ isMaintenanceMode: true });

        if (maintenance) {
            return res.status(201).json({
                success: true,
                maintenancePage: maintenance.maintenancePage,
                message: "This page is under maintenance"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Maintenance mode is disabled!"
            });
        }
    } catch (err) {
        console.error("Error checking maintenance:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};



export const DisableMaintenance = async (req, res) =>
{
         const maintenance = await Maintenance.findOne({ isMaintenanceMode: true });
        const { id } = req.params;
        // const maintenance = await Maintenance.findOne({ createdBy: req.user.id, isMaintenanceMode: true });
        if (!maintenance) return res.status(404).json({ message: "No active maintenance found" });

        maintenance.isMaintenanceMode = false;
        maintenance.maintenancePage = undefined;   
        await maintenance.save();

        res.status(200).json({
            success : true,
            message : "Maintenance Mode Disabled !"
        })
}

export
{
    EnableMaintenance,
    DisableMaintenance
}