function ClientCard({ name, email, company, onView, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h2 className="text-lg font-semibold text-gray-900">
        {name}
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        {company}
      </p>

      <p className="mt-4 text-sm text-gray-600">
        {email}
      </p>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={onView}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          View
        </button>

        <button
          type="button"
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
         onClick={onEdit}
        >
          Edit
        </button>

        <button
  type="button"
 onClick={() => {
    const confirmed = window.confirm(
      `Delete ${name}?`
    )

    if (confirmed) {
      onDelete()
    }
  }}
  className="rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
>
  Delete
</button>
      </div>
    </div>
  )
}

export default ClientCard