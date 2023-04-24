import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const WebsiteRepository: React.FC = () => {
  return (
    <div className="min-h-screen  py-6 flex justify-center items-center">
      <div className="w-full max-w-3xl">
        <div className="bg-white shadow-xl rounded-2xl p-8 mx-auto">
          <h2 className="text-4xl font-bold text-gray-700 mb-6">
            Website Repository
          </h2>
          <p className="text-gray-700 text-2xl mb-6">
            As planned, the repository for this project will be private due to confidential database information. This section will be public during presentations for educational purposes.
          </p>
          <div className="flex justify-end ">
            <a
              href="https://github.com/caoboyeehaw/my-chatgpt-app2-main"
              className="bg-friendly-black3 hover:bg-blue-500 text-bright-white hover:shadow-lg rounded-lg font-bold text-xl px-4 py-2 flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faGithub} className="mr-2" size="xl" />
              Github Repository
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteRepository;