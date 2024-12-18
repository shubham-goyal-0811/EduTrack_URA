import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ComposedChart,
    Label
} from 'recharts';
import { TrendingUp, Users, BookOpen, Video, Clock } from 'lucide-react';
import API from "@/services/api";
import c from "../Styles/Analytics.module.css"
const Analytics = () => {
    const [loading, setLoading] = useState(true);
    const [analyticsData, setAnalyticsData] = useState({
        overview: {
            totalCourses: 0,
            totalLectures: 0,
            totalUsers: 0,
            averageWatchTime: '0'
        },
        userGrowth: [],
        courseStats: [],
        popularCourses: [],
        performanceMetrics: {
            mostPopularCourse: null,
            highestCompletionRate: { courseName: '', rate: '0%' },
            averageRating: 0
        }
    });

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data } = await API.get('/analytics', {
                headers: {
                    token: localStorage.getItem("token"),
                },
            });
            setAnalyticsData(data.data);
        } catch (error) {
            console.error("Error fetching analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon: Icon, trend }) => (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                    <Icon className="h-6 w-6 text-purple-600" />
                </div>
            </div>
            {trend && (
                <div className="flex items-center mt-4 text-green-500 text-sm">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{trend}% increase from last month</span>
                </div>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className={c.container}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className={c.container}>
            <div className={c.heading}>
                <h1 className={c.title}>Analytics Dashboard</h1>
                <p className={c.subtitle}>Detailed insights about your courses and students</p>
            </div>

            {/* Stats Grid */}
            <div className={c.statsGrid}>
                <StatCard
                    title="Total Students"
                    value={analyticsData.overview.totalUsers}
                    icon={Users}
                    trend={12}
                />
                <StatCard
                    title="Total Courses"
                    value={analyticsData.overview.totalCourses}
                    icon={BookOpen}
                    trend={8}
                />
                <StatCard
                    title="Total Lectures"
                    value={analyticsData.overview.totalLectures}
                    icon={Video}
                    trend={15}
                />
               
            </div>

            {/* Charts */}
            <div className={c.gridCharts}>
                {/* Student Growth Chart */}
                <div className={c.chartCard}>
                    <h3 className={c.chartTitle}>Student Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analyticsData.userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="students"
                                stroke="#9b72cf"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                
                
            </div>


            {/* Revenue and Enrollment Statistics */}
            <div className={c.chartCard}>
                <div className="flex items-center justify-between mb-4">
                    <h3  className={c.chartTitle}> Enrollment Statistics</h3>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                            <span className="text-sm text-gray-600">Enrollments</span>
                        </div>
                        
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={analyticsData.revenueStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#9b72cf">
                            <Label
                                value="Enrollments"
                                angle={-90}
                                position="insideLeft"
                                style={{ textAnchor: 'middle' }}
                            />
                        </YAxis>
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#9b72cf"
                            tickFormatter={(value) => `$${value}`}
                        >
                            
                        </YAxis>
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'revenue') return [`$${value}`, 'Revenue'];
                                return [value, 'Enrollments'];
                            }}
                        />
                        <Legend />
                        <Bar
                            yAxisId="left"
                            dataKey="enrollments"
                            fill="#9b72cf"
                            name="Enrollments"
                            radius={[4, 4, 0, 0]}
                        />
                        
                    </ComposedChart>
                </ResponsiveContainer>

                <div className={c.enrollmentsCard}>
                    <div className={c.cardContent}>
                        <h4 className={c.cardSubtitle}>Total Enrollments</h4>
                        <p className={c.cardTotal}>
                            {analyticsData.revenueStats.reduce((acc, curr) => acc + curr.enrollments, 0)}
                        </p>
                        <p className={c.cardSubtitle}>Last 6 months</p>
                    </div>
                </div>

                    
                    
                </div>
        </div>
    );
};

export default Analytics; 