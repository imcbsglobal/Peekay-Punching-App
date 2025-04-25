import React, { useEffect, useState } from "react";
import { getPunchRecords } from "../../api";
import expired from "../../assets/expired.png"

// Format duration from { seconds }
const formatDuration = (seconds = 0) => {
  if (typeof seconds !== "number") return "—";
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hrs}h ${mins}m ${secs}s`;
};

const MapIcon = ({ location }) => {
  // Check if location exists and is in the expected format
  if (!location) return "—";

  // Expected format: "lat,lng" or similar
  const coords = location.split(",").map((coord) => coord.trim());

  if (coords.length !== 2) return location; // Return original if not in expected format

  const googleMapsUrl = `https://www.google.com/maps?q=${coords[0]},${coords[1]}`;

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`View location (${location}) on Google Maps`}
      className="text-cyan-400 hover:text-cyan-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </a>
  );
};

const PunchLogs = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchPunchRecords = async () => {
      try {
        const data = await getPunchRecords();
        setRecords(data.data);
        // Debug logging
        console.log("Photo filenames:", data.data.map(record => record.photo_filename));
      } catch (error) {
        console.error("Error fetching punch records:", error.message);
      }
    };
  
    fetchPunchRecords();
  }, []);

  // Filter records by customer name
  const filteredRecords = records.filter((record) =>
    record.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLast = currentPage * recordsPerPage;
  const indexOfFirst = indexOfLast - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="w-full">
      <div className="text-3xl text-[#fff] mb-6 font-bold text-center pt-10">
        Punch Logs
      </div>

      <div className="grid w-full md:grid-cols-12 gap-10 justify-between items-center mb-5">
        <div className="flex justify-center col-span-12 md:col-span-9 w-full mb-5 md:mb-0">
          <input
            type="text"
            placeholder="Search by Customer Name"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="p-2 w-full rounded-md bg-gray-700 text-white border outline-none border-[#ffffff2d]"
          />
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 md:col-span-3 w-full col-span-12">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded w-full md:w-auto ${
              currentPage === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            Previous
          </button>
          <span className="text-white text-sm w-full">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded w-full ${
              currentPage === totalPages
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            Next
          </button>
        </div>
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
          <tbody className="whitespace-nowrap text-center">
            {currentRecords.map((record, index) => (
              <tr
                key={index}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="px-6 py-4">
                  {new Date(record.punch_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">{record.username || "N/A"}</td>
                <td className="px-6 py-4">{record.customer_name || "N/A"}</td>
                <td className="px-6 py-4">
                  {record.punch_in_time
                    ? new Date(record.punch_in_time).toLocaleTimeString()
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <MapIcon location={record.punch_in_location} />
                </td>

                <td className="px-6 py-4">
                  {record.punch_out_time
                    ? new Date(record.punch_out_time).toLocaleTimeString()
                    : "—"}
                </td>
                <td className="px-6 py-4">
                  <MapIcon location={record.punch_out_location} />
                </td>
                <td className="px-6 py-4">
                  {record.total_time_spent?.seconds != null
                    ? formatDuration(record.total_time_spent.seconds)
                    : "—"}
                </td>

                <td className="px-6 py-4">
                  {record.photo_filename ? (
                    <img
                      src={`/uploads/${record.photo_filename}`}
                      alt="Punch"
                      className="rounded-full border border-cyan-500 shadow-md w-10 h-10 object-cover"
                      onError={(e) => {
                        console.error(`Failed to load image: ${record.photo_filename}`);
                        // Try to log the full URL that failed
                        console.error(`Full URL that failed: ${e.target.src}`);
                        e.target.src = expired;
                        e.target.onerror = null;
                      }}
                    />
                  ) : (
                    <span className="text-gray-400">No photo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PunchLogs;
