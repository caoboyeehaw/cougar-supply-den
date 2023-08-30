import React from 'react';

const GroupMemberList: React.FC = () => {
  return (
    <div className="min-h-screen  py-6 flex justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow-xl rounded-2xl p-8 mx-auto">
          <h2 className="text-4xl font-bold text-gray-700 mb-6">
            Group 10 Members
          </h2>
          <div className="divide-y divide-gray-200">
            <ul className="list-disc pl-7 space-y-2 text-gray-700 text-2xl mb-6">
              <li>Member 1: Dylan Hoang Cao</li>
              <li>Member 2: Benjamin Shek</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupMemberList;