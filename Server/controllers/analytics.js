import TryCatch from "../middlewares/TC.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import scoreCard from "../models/ScoreCard.js";
import  Quiz  from "../models/Quiz.js";
// Get revenue and enrollment statistics for last month
const getRevenueStats = async () => {
  // Get dates for the last 30 days
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      date: d.toLocaleString('default', { day: '2-digit', month: 'short' }),
      startDate: new Date(d.setHours(0, 0, 0, 0)),
      endDate: new Date(d.setHours(23, 59, 59, 999))
    };
  }).reverse();

  const stats = await Promise.all(
    last30Days.map(async ({ date, startDate, endDate }) => {
      // Get successful payments for each day
      const payments = await Payment.aggregate([
        {
          $match: {
            createdAt: {
              $gte: startDate,
              $lte: endDate
            },
            status: "completed"
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalEnrollments: { $sum: 1 }
          }
        }
      ]);

      // Get new subscriptions for each day
      const subscriptions = await User.aggregate([
        {
          $match: {
            "createdAt": {
              $gte: startDate,
              $lte: endDate
            }
          }
        },
        {
          $project: {
            subscriptionCount: { $size: "$subscription" }
          }
        },
        {
          $group: {
            _id: null,
            totalSubscriptions: { $sum: "$subscriptionCount" }
          }
        }
      ]);


      return {
        name: date,
        enrollments: subscriptions[0]?.totalSubscriptions || 0,
        revenue: payments[0]?.totalRevenue || 0
      };
    })
  );

  // Calculate totals
  const totals = stats.reduce((acc, curr) => ({
    totalEnrollments: acc.totalEnrollments + curr.enrollments,
    totalRevenue: acc.totalRevenue + curr.revenue
  }), { totalEnrollments: 0, totalRevenue: 0 });

  return {
    dailyStats: stats,
    totals
  };
};

export const getAnalytics = TryCatch(async (req, res) => {
  const [totalCourses, totalLectures, totalUsers] = await Promise.all([
    Courses.countDocuments(),
    Lecture.countDocuments(),
    User.countDocuments({ role: "user" })
  ]);

  // Get user growth for last 6 months
  const last6Months = [...Array(6)].map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toLocaleString('default', { month: 'short' });
  }).reverse();

  const userGrowth = await Promise.all(
    last6Months.map(async (month) => {
      const startDate = new Date(new Date().getFullYear(), new Date().getMonth() - (last6Months.length - last6Months.indexOf(month) - 1), 1);
      const endDate = new Date(new Date().getFullYear(), new Date().getMonth() - (last6Months.length - last6Months.indexOf(month) - 2), 0);
      
      const count = await User.countDocuments({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });

      return {
        name: month,
        students: count
      };
    })
  );

  // Get popular courses based on subscription count
  const popularCourses = await Courses.aggregate([
    {
      $lookup: {
        from: "users",
        let: { courseId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: ["$$courseId", "$subscription"]
              }
            }
          }
        ],
        as: "enrolledUsers"
      }
    },
    {
      $project: {
        title: 1,
        price: 1,
        enrolledCount: { $size: "$enrolledUsers" },
        revenue: { $multiply: ["$price", { $size: "$enrolledUsers" }] }
      }
    },
    {
      $sort: { enrolledCount: -1 }
    },
    {
      $limit: 5
    }
  ]);

  const { dailyStats, totals } = await getRevenueStats();

  res.json({
    success: true,
    data: {
      overview: {
        totalCourses,
        totalLectures,
        totalUsers,
        monthlyRevenue: totals.totalRevenue,
        monthlyEnrollments: totals.totalEnrollments
      },
      userGrowth,
      revenueStats: dailyStats,
      popularCourses,
      performanceMetrics: {
        mostPopularCourse: popularCourses[0] || null,
        totalRevenue: popularCourses.reduce((acc, course) => acc + course.revenue, 0),
        averageEnrollmentRate: (totals.totalEnrollments / totalCourses).toFixed(1)
      }
    }
  });
});

// Get detailed course analytics
export const getCourseAnalytics = TryCatch(async (req, res) => {
  const courseId = req.params.courseId;

  const course = await Courses.findById(courseId).populate('ratings');
  
  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found"
    });
  }

  // Calculate course statistics
  const totalEnrollments = await User.countDocuments({
    subscription: courseId
  });

  const completionRate = Math.floor(Math.random() * 20) + 80; // Mock data
  const averageRating = course.ratings.reduce((acc, curr) => acc + curr.rating, 0) / course.ratings.length || 0;

  res.json({
    success: true,
    data: {
      title: course.title,
      totalEnrollments,
      completionRate,
      averageRating: averageRating.toFixed(1),
      totalLectures: await Lecture.countDocuments({ course: courseId }),
      ratings: course.ratings
    }
  });
}); 

export const studentScoreGraph = TryCatch(async (req, res) => {
  console.log("coming here");
  const{ userId }= req.body;
  
  const scoreCards = await scoreCard.find({ userId }).populate('quizId');
  
  const quizData = await Promise.all(scoreCards.map(async (ScoreCard) => {
    const quiz = await Quiz.findById(ScoreCard.quizId).populate('course');
    return {
      courseName: quiz.course.title,
      quizTitle: quiz.title,
      marksScored: ScoreCard.marksScored,
    };
  }));
  
  res.json({
    success: true,
    data: quizData
  });
});
