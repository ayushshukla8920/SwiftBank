import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

const TransactionGraph = ({ }) => {
  const data = [
    { name: "Money Received", amount: 500 },
    { name: "Money Spent", amount: 1000 },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} domain={[0, 'dataMax']} />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#4CAF50" name="Amount (₹)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TransactionGraph;
