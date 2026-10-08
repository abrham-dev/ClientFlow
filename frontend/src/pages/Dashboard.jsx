import StatCard from '../components/StatCard'
import ProjectRow from '../components/ProjectRow'
import TaskRow from '../components/TaskRow'

function Dashboard() {
  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back to ClientFlow.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Clients"
          value="0"
        />

        <StatCard
          title="Active Projects"
          value="0"
        />

        <StatCard
          title="Open Tasks"
          value="0"
        />

        <StatCard
          title="Completed Tasks"
          value="0"
        />
      </div>


      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Projects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your most recently created projects.
          </p>
        </div>

        <div className="px-5">
          <ProjectRow
            name="Website Redesign"
            client="Acme Corporation"
            status="In Progress"
          />

          <ProjectRow
            name="Mobile App Development"
            client="Bright Solutions"
            status="Planning"
          />

          <ProjectRow
            name="Brand Identity"
            client="Nova Studio"
            status="Completed"
          />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white">
  <div className="border-b border-gray-200 p-5">
    <h2 className="text-lg font-semibold text-gray-900">
      Recent Tasks
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Your most recently created tasks.
    </p>
  </div>

  <div className="px-5">
    <TaskRow
      title="Create homepage design"
      project="Website Redesign"
      status="To Do"
    />

    <TaskRow
      title="Review API requirements"
      project="Mobile App Development"
      status="In Progress"
    />

    <TaskRow
      title="Finalize brand colors"
      project="Brand Identity"
      status="Completed"
    />
  </div>
</div>
    </section>
  )
}

export default Dashboard