import API from "@/services/api";
import React from "react";
import { useEffect,useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { UserData } from "@/context/UserContext";

const ScoreGraphs = () => {
  const [dynamicData, setDynamicData] = useState([]);
  const data = dynamicData.map((item) => ({
    name: item.courseName,
    [item.quizTitle]: item.marksScored,
  }));
  const {user} = UserData();
  useEffect(() => {
    const func = async()=>{
    const cleanup = await API.post("/analytics/student/fetchGraphData", {userId: user._id},{
      headers:{
        'token' : localStorage.getItem('token'),
      }
    })
    setDynamicData(cleanup.data.data);
    }
    func();
  }, []);

  return (
    <div className="scoreGraphs" style={{ width: '100%', height: '300px' }}>
      <h2 className="text-lg font-bold mb-2">Score Statistics</h2>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart 
          data={data}
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
        >
          <XAxis 
            dataKey="name" 
            stroke="#888888"
            tickSize={5}
            padding={{ left: 10, right: 10 }}
            label={{ value: 'Tests', position: 'bottom', offset: 5 }}
          />
          <YAxis 
            stroke="#888888"
            domain={[0, 10]}
            ticks={[ 1, 3, 5, 7,9]}
            label={{ value: 'Marks', angle: -90, position: 'insideLeft', offset: 10 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          {dynamicData.map((item) => (
            <Line 
              key={item.quizTitle}
              type="monotone" 
              dataKey={item.quizTitle} 
              stroke="#8B5CF6" // Purple
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