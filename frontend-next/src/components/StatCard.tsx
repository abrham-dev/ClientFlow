// Define the types of props this component accepts.
type StatCardProps = {
  title: string
  value: number
}

// Display a single dashboard statistic.
function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold text-gray-900">
        {value}
      </p>
    </div>
  )
}

export default StatCard