function ProjectRow({ name, client, status }) {
  return (
    <div className="flex flex-col gap-2 border-b border-gray-100 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="font-medium text-gray-900">
          {name}
        </h3>

        <p className="text-sm text-gray-500">
          {client}
        </p>
      </div>

      <span className="w-fit rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
        {status}
      </span>
    </div>
  )
}

export default ProjectRow