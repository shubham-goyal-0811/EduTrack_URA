import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BookOpen, Users, Video, TrendingUp } from 'lucide-react'
import API from "@/services/api"
import Analytics from "@/pages/Analytics"

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 bg-purple-100 rounded-lg">
        <Icon className="h-5 w-5 text-purple-600" />
      </div>
      {trend && (
        <div className="flex items-center text-green-500 text-sm">
          <TrendingUp className="h-4 w-4 mr-1" />
          {trend}%
        </div>
      )}
    </div>
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
  </div>
)

export default function AdminDashboard({ user }) {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalLectures: 0,
    totalUsers: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user && user.role !== "teacher") {
      navigate("/")
    } else {
      fetchStats()
    }
  }, [user, navigate])

  async function fetchStats() {
    try {
      setIsLoading(true)
      const { data } = await API.get(`/stats`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      setStats(data.stats)
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
      <Analytics />
    </div>
  )
}