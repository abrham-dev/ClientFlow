function Profile() {
  return (
    <section>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Profile
        </h1>

        <p className="mt-2 text-gray-600">
          Manage your account information.
        </p>
      </div>

      <div className="mt-8 max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Account Information
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Your personal account details.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Username
            </p>

            <p className="mt-1 text-gray-900">
              abrham
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">
              Email
            </p>

            <p className="mt-1 text-gray-900">
              abrham@example.com
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Profile