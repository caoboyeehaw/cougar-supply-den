import React from 'react';

const ProjectInformation: React.FC = () => {
  return (
    <div className="min-h-screen y-6 flex justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow-xl rounded-2xl p-8 mx-auto">
          <h2 className="text-4xl font-bold text-gray-700 mb-4">
            Project Information
          </h2>
          <p className="text-gray-700 mb-4 text-2xl">
            Our team developed a Point-of-Sales web application focused around selling materials frequently used by University of Houston faculty and students. The functionality of our application implements customer account creations and administration properties such as adding/deleting/updating products. The application is hosted on Vercel and developed using MSSQL with Microsoft Azure as our database cloud service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectInformation;