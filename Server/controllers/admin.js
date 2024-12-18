import TryCatch from "../middlewares/TC.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { rm } from "fs";
import { promisify } from "util";
import fs from "fs";
import { User } from "../models/User.js";
import { UploadToS3Bucket } from "../config/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "../config/s3.js";


export const createCourse = TryCatch(async (req, res) => {
  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;

  // if()

  let imageUrl = null;

  if (image) {
    console.log("Image is present");
    const fileBuffer = await fs.promises.readFile(image.path);
    const s3Key = `courses/${Date.now()}-${image.originalname}`;
    
    await UploadToS3Bucket({
      filename: s3Key,
      fileContent: fileBuffer,
      mimetype: image.mimetype,
    });

    console.log("File upload success");

    await fs.promises.unlink(image.path);

    imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${s3Key}`;
  }

  await Courses.create({
    title,
    description,
    category,
    createdBy: req.user._id,
    image: imageUrl,
    duration,
    price,
  });

  res.status(201).json({
    message: "Course Created Successfully",
  });
});

export const addLectures = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  if(course.createdBy.toString() !== req.user._id.toString()){
    
    return res.status(403).json({
      message: "You are not authorized to add lectures to this course"
    });
  }
  if (!course)
    return res.status(404).json({
      message: "No Course with this id",
    });

  const { title, description } = req.body;
  const file = req.file;

  let videoUrl = null;

  if (file) {
    try {
      const fileBuffer = await fs.promises.readFile(file.path);
      const s3Key = `lectures/${Date.now()}-${file.originalname}`;
      
      await UploadToS3Bucket({
        filename: s3Key,
        fileContent: fileBuffer,
        mimetype: file.mimetype,
      });

      // Clean up local file after successful upload
      await fs.promises.unlink(file.path);

      // Construct the S3 URL
      videoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${s3Key}`;
      
      console.log('Video uploaded successfully:', videoUrl);
    } catch (error) {
      console.error('Error uploading video:', error);
      return res.status(500).json({
        message: "Error uploading video",
      });
    }
  }

  const lecture = await Lecture.create({
    title,
    description,
    video: videoUrl,
    course: course._id,
  });

  res.status(201).json({
    message: "Lecture Added",
    lecture,
  });
});

export const deleteLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
   
  const course = await Courses.findById(lecture.course);
  if(course.createdBy.toString() !== req.user._id.toString()){
    return res.status(403).json({
      message: "You are not authorized to delete lectures from this course"
    });
  }
  if (lecture.video) {
    const videoKey = extractS3Key(lecture.video);
    if (videoKey) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: videoKey,
        });
        await s3Client.send(deleteCommand);
        console.log('Video deleted from S3');
      } catch (error) {
        console.error('Error deleting video from S3:', error);
      }
    }
  }

  await lecture.deleteOne();
  res.json({ message: "Lecture Deleted" });
});

export const deleteCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  
  if (!course) {
    return res.status(404).json({
      message: "Course not found"
    });
  }

  if(course.createdBy.toString() !== req.user._id.toString()){
    return res.status(403).json({
      message: "You are not authorized to delete this course"
    });
  }

  if (course.image) {
    const imageKey = extractS3Key(course.image);
    if (imageKey) {
      try {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: imageKey,
        });
        await s3Client.send(deleteCommand);
        console.log('Course image deleted from S3');
      } catch (error) {
        console.error('Error deleting course image from S3:', error);
      }
    }
  }

  const lectures = await Lecture.find({ course: course._id });

  await Promise.all(
    lectures.map(async (lecture) => {
      if (lecture.video) {
        const videoKey = extractS3Key(lecture.video);
        if (videoKey) {
          try {
            const deleteCommand = new DeleteObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME,
              Key: videoKey,
            });
            await s3Client.send(deleteCommand);
            console.log('Lecture video deleted from S3');
          } catch (error) {
            console.error('Error deleting lecture video from S3:', error);
          }
        }
      }
    })
  );

  await Promise.all([
    Lecture.deleteMany({ course: req.params.id }),
    course.deleteOne(),
    User.updateMany({}, { $pull: { subscription: req.params.id } })
  ]);


  res.json({
    message: "Course Deleted Successfully",
  });
});

function extractS3Key(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.substring(1);
  } catch (error) {
    console.error('Error extracting S3 key:', error);
    return null;
  }
}

export const getAllStats = TryCatch(async (req, res) => {
  const totalCoures = (await Courses.find()).length;
  const totalLectures = (await Lecture.find()).length;
  const totalUsers = (await User.find()).length;

  const stats = {
    totalCoures,
    totalLectures,
    totalUsers,
  };

  res.json({
    stats,
  });
});

export const getAllUser = TryCatch(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select(
    "-password"
  );

  res.json({ users });
});

export const updateRole = TryCatch(async (req, res) => {
  if (req.user.mainrole !== "superadmin")
    return res.status(403).json({
      message: "This endpoint is assign to superadmin",
    });
  const user = await User.findById(req.params.id);

  if (user.role === "user") {
    user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "Role updated to admin",
    });
  }

  if (user.role === "admin") {
    user.role = "user";
    await user.save();

    return res.status(200).json({
      message: "Role updated",
    });
  }
});