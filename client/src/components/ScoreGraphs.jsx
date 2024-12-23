
import API from "@/services/api";
import React, { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { UserData } from "@/context/UserContext";

const ScoreGraphs = () => {
  const [dynamicData, setDynamicData] = useState([]);
  const { user } = UserData();

  // Process the data to align all tests (quizTitle) on the X-axis
  const processedData = dynamicData.reduce((acc, item) => {
    // Find if quizTitle already exists in the accumulator
    let testEntry = acc.find((entry) => entry.name === item.quizTitle);

    if (!testEntry) {
      // If not found, create a new entry with the quizTitle as the name
      testEntry = { name: item.quizTitle };
      acc.push(testEntry);
    }

    // Add the courseName and marksScored as a key-value pair
    testEntry[item.courseName] = item.marksScored;

    return acc;
  }, []);

  // Extract unique course names for rendering lines
  const courseNames = [...new Set(dynamicData.map((item) => item.courseName))];

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await API.post(
          "/analytics/student/fetchGraphData",
          { userId: user._id },
          {
            headers: {
              token: localStorage.getItem("token"),
            },
          }
        );
        console.log(response.data.data);
        setDynamicData(response.data.data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };
    fetchGraphData();
  }, [user]);

  return (
    <div className="scoreGraphs" style={{ width: "100%", height: "300px" }}>
      <h2 className="text-lg font-bold mb-2">Score Statistics</h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={processedData}
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
        >
          <XAxis
            dataKey="name"
            stroke="#888888"
            tickSize={5}
            padding={{ left: 10, right: 10 }}
            label={{ value: "Tests", position: "bottom", offset: 5 }}
          />
          <YAxis
            stroke="#888888"
            domain={[0, 10]} // Adjust domain based on your marks range
            ticks={[1, 3, 5, 7, 9]}
            label={{ value: "Marks", angle: -90, position: "insideLeft", offset: 10 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          {courseNames.map((course) => (
            <Line
              key={course}
              type="monotone"
              dataKey={course}
              stroke="#8B5CF6" // Generate random color
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreGraphs;
