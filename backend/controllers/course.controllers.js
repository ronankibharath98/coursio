import { Courses } from "../models/course.model.js";
import { Purchases } from "../models/purchase.model.js";

export const addCourse = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            return res.stauts(400).json({
                message: "All fields required",
                success: false
            })

        }

        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({
                message: "No access token provided, You're not authorised to Add course",
                success: false
            });
        }

        // Verify access token
        let adminId;
        try {
            const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
            adminId = decoded.adminId;
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired access token",
                success: false
            });
        }

        const existingCourse = await Courses.findOne({ title, createdBy: adminId });

        if (existingCourse) {
            return res.status(409).json({
                message: "A course with the same title added by you.",
                success: false,
                existingCourse
            })
        }

        const newCourse = new Courses({
            title,
            description,
            price,
            createdBy: adminId
        })

        await newCourse.save();

        return res.status(200).json({
            message: `Course ${title} created Successfully`,
            success: true,
            course: newCourse

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error in adding course",
            success: false
        })
    }
}

export const updateCourse = async (req, res) => {
    const { title, description, price } = req.body;
    const courseId = req.params.id;

    const accessToken = req.cookies.accessToken;
    
    if (!accessToken) {
        return res.status(401).json({
            message: "No access token recieved",
            success: false
        })
    }
   
    let adminId;
    try {
        const decoded = jwt.verify(accessToken, process.env.ADMIN_ACCESS_TOKEN_SECRET)
        adminId = decoded.adminId;
    } catch (err) {
        console.log("Error in decoding access token", err)
        return res.status(401).json({
            message: "Invalid or expired access token",
            success: false
        })
    }
    
    try{
        const course = await Courses.findById(courseId);
        // console.log(course)
        if (!course){
            return res.staus(404).json({
                message: "course not found",
                success: false
            })
        }
        if (course.createdBy.toString() !== adminId.toString()){
            return res.status(401).json({
                message: "You're are not authorized to edit this course",
                success: false
            })
        }
        
        if (title) course.title = title;
        if (description) course.description = description;
        if (price) course.price = price;        

        await course.save();

        return res.status(200).json({
            message: "Course updated successfully",
            success: true,
            course
        })
    }catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Server error in updating course",
            success: false
        })
    }
}

export const getAllCourses = async( req, res ) => {
    try{
        const allCourses = await Courses.find();

        if (!allCourses || allCourses.length == 0) {
            return res.status(404).json({
                message: "No courses found",
                success: false
            })
        }

        return res.status(200).json({
            message: "All courses fetched successfully",
            success: true,
            allCourses
        })
    }catch(error){
        return res.status(500).json({
            message: "Server error in fetching all courses",
            success: false
        })
    }
}

export const applyCourse = async (req, res) => {
    try{
        const paymentStatus = {
            success : true
        }

        const courseId = req.params.id;
        const applicantId = req.user.tokenId

        const alreadyApplied = await Courses.findOne({
            _id: courseId,
            applicants: applicantId
        })
        
        if (alreadyApplied) {
            return res.status(400).json({
                message: 'User has already applied for this course',
                success: false
            });
        }

        if (!paymentStatus){
            return res.status(402).json({
                message: "Payment failed please retry",
                success: false
            })
        }
        
        const newPurchase = new Purchases({
            courseId: courseId,
            userId: applicantId
        })
        await newPurchase.save();
        
        // add the user to course applicants list
        await Courses.findByIdAndUpdate(
            courseId,
            { $push: {applicants: applicantId}},
            { new: true }
        )
        return res.status(200).json({
            message: "Purchase success, Applied Successfully",
            success: true,
            newPurchase
        })

    } catch(error){
        console.log(error)
        return res.status(500).json({
            message: "Server error in applying to course",
            success: false
        })
    }

}