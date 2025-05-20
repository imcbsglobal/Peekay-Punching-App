import { FaUser } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import React, { useEffect, useState } from "react";
import { getPunchRecords } from "../../api";
import expired from "../../assets/expired.png"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MdClose } from "react-icons/md";
import { getUsers, getMasterData } from "../../api";
import { IoIdCardSharp } from "react-icons/io5";

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

const AdminConsole = () => {
    const [records, setRecords] = useState([]);
    const [viewImage, setViewImage] = useState(false)
    const [selectedImage, setSelectedImage] = useState("");
    const [userCount, setUserCount] = useState(0);
    const [customerCount, setCustomerCount] = useState(0);
    const uniqueClientIds = [...new Set(records.map(record => record.client_id))];

    useEffect(() => {
        const fetchPunchRecords = async () => {
          try {
            const data = await getPunchRecords();
            console.log("Data iS", data)
            setRecords(data.data);
            // setFilteredRecordss(records);
            // Debug logging
            // console.log("Photo filenames:", data.data.map(record => record.photo_filename));
          } catch (error) {
            console.error("Error fetching punch records:", error.message);
          }
        };
        const fetchUserAndCustomerCounts = async () => {
            try {
              const usersResponse = await getUsers();
              setUserCount(usersResponse.data?.length || 0);
        
              const masterResponse = await getMasterData();
              setCustomerCount(masterResponse.data?.length || 0);
            } catch (error) {
              console.error("Error fetching users/customers:", error.message);
            }
          };
      
        fetchPunchRecords();
        fetchUserAndCustomerCounts();
      }, []);

  return (
    <div className="md:pt-[80px] pt-16 overflow-hidden">
      <section>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full place-items-center gap-2 md:gap-10 mb-2 md:mb-10">
            <div className="w-full h-[150px] bg-[#ffffff13] text-[#fff] border border-[#EEB31B] rounded-3xl flex flex-col justify-center items-center gap-2">
              <div className="text-2xl font-semibold">Total Users</div>
              <div className="flex justify-center items-center gap-2  text-3xl">
                <FaUser className="text-[#EEB31B]" />{" "}
                <span className="font-bold">{userCount}</span>
              </div>
            </div>
            {uniqueClientIds.map((client_id, index) => (
              <div
                key={index}
                className="w-full h-[150px] bg-[#ffffff13] text-[#fff] border border-[#EEB31B] rounded-3xl flex flex-col justify-center items-center gap-2"
              >
                <div className="text-2xl font-semibold">Client ID</div>
                <div className="flex justify-center items-center gap-2 text-3xl">
                  <IoIdCardSharp className="text-[#EEB31B]" />
                  <span className="font-bold">{client_id}</span>
                </div>
              </div>
            ))}
            <div className="w-full h-[150px] bg-[#ffffff13] text-[#fff] border border-[#EEB31B] rounded-3xl flex flex-col justify-center items-center gap-2">
              <div className="text-2xl font-semibold">Total Customers</div>
              <div className="flex justify-center items-center gap-2  text-3xl">
                <FaUser className="text-[#EEB31B]" />{" "}
                <span className="font-bold">{customerCount}</span>
              </div>
            </div>
          </div>
          <div className="h-[570px] bg-[#ffffff13] w-full rounded-3xl mb-5 md:mb-10 py-5 md:py-10 px-2 md:px-10">
            <div className="text-3xl font-semibold text-[#fff] mb-5 text-center md:text-start">
              Recent Punch Logs
            </div>
            <div className="overflow-x-auto rounded-xl md:shadow-xl overflow-hidden">
              <table className="w-full table-auto border-collapse bg-gradient-to-tr  text-xs text-white overflow-hidden">
                <thead className="text-[#ffffffb7] font-light border-b uppercase border-gray-700">
                  <tr className="font-light">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Client ID</th>
                    <th className="px-6 py-4">Customer Name</th>
                    <th className="px-6 py-4">Punch In Time</th>
                    <th className="px-6 py-4">Punch In Location</th>
                    <th className="px-6 py-4">Punch Out Time</th>
                    <th className="px-6 py-4">Punch Out Location</th>
                    <th className="px-6 py-4">Punch Out Date</th>
                    <th className="px-6 py-4">Total Time</th>
                    <th className="px-6 py-4">Photo</th>
                  </tr>
                </thead>
                <tbody className="whitespace-nowrap text-center">
                  {records.slice(0, 5).map((record, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="px-6 py-4">
                        {/* {new Date(record.punch_date).toLocaleDateString()} */}
                        <li key={index} className="list-none">
                          {new Date(record.punch_date).toLocaleDateString()}
                          {record.punch_time}
                        </li>
                      </td>
                      <td className="px-6 py-4">{record.username || "N/A"}</td>
                      <td className="px-6 py-4">{record.client_id || "N/A"}</td>
                      <td className="px-6 py-4">
                        {record.customer_name || "N/A"}
                      </td>
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
                          : "Pending"}
                      </td>
                      <td className="px-6 py-4">
                        <MapIcon location={record.punch_out_location} />
                      </td>
                      <td className="px-6 py-4">
                        {new Date(record.punch_out_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {record.total_time_spent
                          ? formatDuration(
                              (record.total_time_spent.minutes || 0) * 60 +
                                (record.total_time_spent.seconds || 0)
                            )
                          : "Pending"}
                      </td>

                      <td className="px-6 py-4">
                        {record.photo_url ? (
                          <img
                            onClick={() => {
                              setSelectedImage(record.photo_url);
                              setViewImage(true);
                            }}
                            src={record.photo_url}
                            alt="Punch"
                            className="rounded-full border border-cyan-500 shadow-md w-10 h-10 object-cover cursor-pointer"
                            onError={(e) => {
                              console.error(
                                `Failed to load image: ${record.photo_filename}`
                              );
                              // Try to log the full URL that failed
                              console.error(
                                `Full URL that failed: ${e.target.src}`
                              );
                              e.target.src = expired;
                              e.target.onerror = null;
                            }}
                          />
                        ) : (
                          <img
                            src={expired}
                            alt=""
                            className="rounded-full border border-cyan-500 shadow-md w-10 h-10 object-cover"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {viewImage && (
              <div className="fixed top-0 right-0 bottom-0 left-0 h-full w-full bg-[#000000c4] z-[999] flex justify-center items-center">
                <div
                  className="absolute top-5 right-5 text-white text-3xl cursor-pointer"
                  onClick={() => setViewImage(false)}
                >
                  <MdClose />
                </div>
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-w-full max-h-[90%] rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminConsole
