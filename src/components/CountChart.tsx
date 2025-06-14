"use client"

import Image from "next/image"
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

export function CountChart({ male, female }: { male: number; female: number }) {
  const total = male + female
  const malePercentage = total > 0 ? Math.round((male / total) * 100) : 0
  const femalePercentage = total > 0 ? Math.round((female / total) * 100) : 0

  const data = [
    { name: "Boys", count: male, fill: "#C3EBFA" },
    { name: "Girls", count: female, fill: "#FAE27C" },
  ]

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Students</h1>
        <Image src="/moreDark.png" alt="options" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" cornerRadius={8} />
            <Tooltip
              formatter={(value: number, name: string) => [`${value}`, name]}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* CENTER ICON */}
        <Image
          src="/maleFemale.png"
          alt="icon"
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* LEGEND */}
      <div className="flex justify-center gap-16 pt-2">
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-[#C3EBFA] rounded-full" />
          <h1 className="font-bold">{male}</h1>
          <h2 className="text-xs text-gray-500">Boys ({malePercentage}%)</h2>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-5 h-5 bg-[#FAE27C] rounded-full" />
          <h1 className="font-bold">{female}</h1>
          <h2 className="text-xs text-gray-500">Girls ({femalePercentage}%)</h2>
        </div>
      </div>
    </div>
  )
}
