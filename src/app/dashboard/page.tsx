import UsersTable from "@/components/users/UsersTable"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users</h1>
      <UsersTable />
    </div>
  )
}
