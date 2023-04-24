import Link from 'next/link';
import React from 'react';

const TerminalPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-friendly-grey py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow-xl rounded sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Project Terminal</h2>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <ul className="list-disc space-y-2">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center sm:h-7">
                      Project Requirements and such will go here.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          {/* Modify styling here */}
          <div className="flex justify-end mb-4">
              <div
                className="text-friendly-black3 hover:shadow-lg text-sm mt-5 font-bold rounded px-10 py-10 hover:bg-cougar-gold-dark bg-cougar-gold"
              >
                <Link href="/SalesReports">Sales Reports</Link>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <div
                className="text-friendly-black3 hover:shadow-lg text-sm mt-5 font-bold rounded px-10 py-10 hover:bg-cougar-gold-dark bg-cougar-gold"
              >
                <Link href="/StockReports">Stock Reports</Link>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <div
                className="text-friendly-black3 hover:shadow-lg text-sm mt-5 font-bold rounded px-10 py-10 hover:bg-cougar-gold-dark bg-cougar-gold"
              >
                <Link href="/ProductList">Product List</Link>
              </div>
            </div>


            <div className="flex justify-end mb-4">
              <div
                className="text-friendly-black3 hover:shadow-lg text-sm mt-5 font-bold rounded px-10 py-10 hover:bg-cougar-gold-dark bg-cougar-gold"
              >
                <Link href="/SupplierList">Supplier List</Link>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <div
                className="text-friendly-black3 hover:shadow-lg text-sm mt-5 font-bold rounded px-10 py-10 hover:bg-cougar-gold-dark bg-cougar-gold"
              >
                <Link href="/ManageList">Manage List</Link>
              </div>
            </div>


            <div className="flex justify-end mb-4">
              <div
                className="text-friendly-black3 hover:shadow-lg text-sm mt-5 font-bold rounded px-10 py-10 hover:bg-cougar-gold-dark bg-cougar-gold"
              >
                <Link href="/ManageOrder">Manage Order</Link>
              </div>
            </div>
            

            <div className="flex justify-end mb-4">
              <div
                className="text-friendly-black3 hover:shadow-lg text-sm mt-5 font-bold rounded px-10 py-10 hover:bg-cougar-gold-dark bg-cougar-gold"
              >
                <Link href="/ManageUsers">Manage Users</Link>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalPage;