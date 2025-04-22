import React, { useState, useEffect } from 'react';
import { getMasterData } from '../../api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  const customersPerPage = 10;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getMasterData();
        setCustomers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Failed to fetch customers");
        console.error(err);
      }
    };

    fetchCustomers();
  }, []);

  // Filter customers based on the search query
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  return (
    <div>
      <div className="text-3xl text-white mb-6 font-bold text-center pt-10">
        Customers
      </div>

      <div className='grid w-full md:grid-cols-12 justify-between items-center mb-5'>
        <div className="flex justify-center col-span-9 w-full">
          <input
            type="text"
            placeholder="Search by Customer..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 w-full rounded-md bg-gray-700 text-white border outline-none border-[#ffffff2d]"
          />
        </div>
        <div className="flex justify-center gap-4 col-span-3 w-full">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white`}
          >
            Previous
          </button>
          <span className="text-white self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'} text-white`}
          >
            Next
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="overflow-x-auto rounded-xl shadow-xl overflow-hidden">
        <table className="w-full table-auto border-collapse bg-gradient-to-tr from-gray-800 to-gray-900 text-xs text-white overflow-hidden">
          <thead className="text-[#ffffffb7] font-light border-b uppercase border-gray-700">
            <tr className="font-light">
              <th className="px-6 py-4 text-left">Customer</th>
              <th className="px-6 py-4 text-left">Address</th>
              <th className="px-6 py-4 text-left">Code</th>
              <th className="px-6 py-4 text-left">Place</th>
              <th className="px-6 py-4 text-left">Super Code</th>
            </tr>
          </thead>
          <tbody>
            {currentCustomers.length > 0 ? (
              currentCustomers.map((customer, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-6 py-4">{customer.name}</td>
                  <td className="px-6 py-4">{customer.address || 'null'}</td>
                  <td className="px-6 py-4">{customer.code}</td>
                  <td className="px-6 py-4">{customer.place || 'null'}</td>
                  <td className="px-6 py-4">{customer.super_code}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
