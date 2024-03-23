import {AreaChart, Area, ResponsiveContainer, YAxis, XAxis, CartesianGrid, Tooltip, Legend} from "recharts"

const productSales = [
  {
    name: 'Jan',
    product1: 4000,
    product2: 2400,
  },
  {
    name: 'Feb',
    product1: 3000,
    product2: 2210,
  },
  {
    name: 'Mar',
    product1: 2000,
    product2: 2290,
  },
  {
    name: 'Apr',
    product1: 2780,
    product2: 2000,
  },
  {
    name: 'May',
    product1: 1890,
    product2: 2181,
  },
  {
    name: 'Jun',
    product1: 2390,
    product2: 2500,
  },
];

const AreaCharts = ({data}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">

       <AreaChart
        width={400}
        height={300}
        data={data}
        margin={{ right: 30 }}
      >
         <YAxis tick={{ fill: 'white' }}  />
        <XAxis dataKey="year"tick={{ fill: 'white' }} />
        <CartesianGrid strokeDasharray="5 5" />

        {/* <Tooltip content={<CustomTooltip />} /> */}
        <Legend />

        <Area
          type="monotone"
          dataKey="flora"
          stroke="#2563eb"
          fill="#3b82f6"
          stackId="1"
        />

        <Area
          type="monotone"
          dataKey="fauna"
          stroke="#7c3aed"
          fill="#8b5cf6"
          stackId="1"
        />
      </AreaChart>
    </ResponsiveContainer>
    
  )
}

export default AreaCharts
