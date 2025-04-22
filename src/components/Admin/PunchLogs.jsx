import React from 'react'

const PunchLogs = () => {
  return (
    <div>
      <div className="text-3xl text-[#fff] mb-6 font-bold text-center pt-10">
        Punch Logs
      </div>
      <div className="overflow-x-auto rounded-xl shadow-xl overflow-hidden">
        <table className="w-full table-auto border-collapse bg-gradient-to-tr from-gray-800 to-gray-900 text-xs text-white overflow-hidden">
          <thead className="text-[#ffffffb7] font-light border-b uppercase border-gray-700">
            <tr className="font-light">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Customer Name</th>
              <th className="px-6 py-4">Punch In Time</th>
              <th className="px-6 py-4">Punch In Location</th>
              <th className="px-6 py-4">Punch Out Time</th>
              <th className="px-6 py-4">Punch Out Location</th>
              <th className="px-6 py-4">Total Time</th>
              <th className="px-6 py-4">Photo</th>
            </tr>
          </thead>
          <tbody className='whitespace-nowrap text-center'>
            {/* Sample Row */}
            <tr className="border-b border-gray-700 hover:bg-gray-800 transition">
              <td className="px-6 py-4">2025-04-17</td>
              <td className="px-6 py-4">John Doe</td>
              <td className="px-6 py-4">Acme Corp</td>
              <td className="px-6 py-4">08:45 AM</td>
              <td className="px-6 py-4">New York, NY</td>
              <td className="px-6 py-4">05:30 PM</td>
              <td className="px-6 py-4">Brooklyn, NY</td>
              <td className="px-6 py-4">8h 45m</td>
              <td className="px-6 py-4">
                <img
                  src="https://via.placeholder.com/40"
                  alt="Punch Photo"
                  className="rounded-full border border-cyan-500 shadow-md"
                />
              </td>
            </tr>
            {/* Add more rows dynamically */}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PunchLogs
