import { Purchases } from "../models/purchase.model.js";


export const getEnrollments = async (req, res) => {
    try {
        const adminId = req.admin.adminId;
        const courseId = req.params.id;
        if (!adminId) {
            return res.status(404).json({
                message: "Admin not found",
                success: "false"
            })
        }

        if (!courseId) {
            return res.status(404).json({
                message: "Course not found or incorrect course id",
                success: "false"
            })
        }

        const enrollments = await Purchases.find({ courseId }).populate('userId', 'firstName email')
        console.log(enrollments)

        const enrollmentCount = enrollments.length;

        return res.status(200).json({
            message: "Enrollments fetched successfully",
            success: true,
            enrollmentCount,
            users: enrollments.map(enrollment => enrollment.userId)
        })
    }catch(error){
        return res.status(500).json({
            message: "Server error in fetching Enrollments",
            success: false
        })
    }
}