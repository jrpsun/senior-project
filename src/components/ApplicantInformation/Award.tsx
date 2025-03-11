'use client';

import { useState } from 'react';
import React from 'react';
import FileUpload from '@components/components/FileUpload';
import BackNextButt from '@components/components/BackNextButt';
import Talent from '@components/components/Talent';

const Award = () => {

  const [containers, setContainers] = useState([{ id: Date.now() }]);

  // Function to add a new container
  const addContainer = () => {
    setContainers([...containers, { id: Date.now() }]);
  };

  // Function to remove a specific container
  const removeContainer = (id) => {
    setContainers(containers.filter(container => container.id !== id));
  };

  return (
    <div>

      {containers.map(container => (
        <div key={container.id}>
          <div className="flex justify-center pt-10 bg-[#FFFFFF] p-6">
            <div className="w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-[#008A90] mb-4">
                  Reward and Works in Computer
                </h1>
                <button
                  className=''
                  onClick={() => removeContainer(container.id)}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_333_15749)">
                      <path d="M10.9995 22C8.06614 22 5.31615 20.9 3.20781 18.7917C-1.10052 14.4833 -1.10052 7.51667 3.20781 3.20833C5.31615 1.1 8.06614 0 10.9995 0C13.9328 0 16.6828 1.1 18.7911 3.20833C23.0995 7.51667 23.0995 14.4833 18.7911 18.7917C16.6828 20.9 13.9328 22 10.9995 22ZM10.9995 1.83333C8.52448 1.83333 6.23281 2.75 4.49115 4.49167C0.916146 8.06667 0.916146 13.9333 4.49115 17.5083C6.23281 19.25 8.52448 20.1667 10.9995 20.1667C13.4745 20.1667 15.7661 19.25 17.5078 17.5083C21.0828 13.9333 21.0828 8.15833 17.5078 4.58333C15.7661 2.75 13.4745 1.83333 10.9995 1.83333Z" fill="#D92D20" />
                      <path d="M15.5833 11.9173H6.41667C5.86667 11.9173 5.5 11.5507 5.5 11.0007C5.5 10.4507 5.86667 10.084 6.41667 10.084H15.5833C16.1333 10.084 16.5 10.4507 16.5 11.0007C16.5 11.5507 16.1333 11.9173 15.5833 11.9173Z" fill="#D92D20" />
                    </g>
                    <defs>
                      <clipPath id="clip0_333_15749">
                        <rect width="22" height="22" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
              <div className="mb-6">
                <h2 className="text-lg font-medium text-gray-800">Computer-Related Certificates or Awards<span className='text-[#D92D20]'> *</span></h2>
                <div className="text-[#B3B3B3] mt-2">
                  <div className="flex flex-col">
                    <div className="flex items-baseline space-x-2">
                      <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                      </svg>
                      <span>
                        Upload a certificate or document related to a computer award, one file per entry (PDF format, maximum file size 5 MB)
                      </span>
                    </div>
                  </div>
                </div>
                <br />
                <FileUpload />
              </div>
              <div className='flex justify-start gap-y-5 flex-col'>
                <div className='flex justify-start gap-x-7'>
                  <div className='flex flex-col'>
                    Name of Competition
                    <input
                      type="text"
                      placeholder='Enter Name of Competition'
                      className='w-[330px] border border-gray-300 rounded-lg px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    />
                  </div>
                </div>

                <div className='flex justify-start gap-x-7'>
                  <div className='flex flex-col'>
                    Year of Competition
                    <select defaultValue="Select Year of Competition" className='w-[330px] border border-gray-300 rounded-lg px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'>
                      <option value="Select Year of Competition" disabled>Select Year of Competition</option>
                      <option value="opt1">Option 1</option>
                      <option value="opt2">Option 2</option>
                      <option value="opt3">Option 3</option>
                    </select>
                  </div>
                  <div className='flex flex-col'>
                    Level of Competition
                    <select defaultValue="Select Level of Competition" className='w-[330px] border border-gray-300 rounded-lg px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'>
                      <option value="Select Level of Competition" disabled>Select Level of Competition</option>
                      <option value="opt1">Option 1</option>
                      <option value="opt2">Option 2</option>
                      <option value="opt3">Option 3</option>
                    </select>
                  </div>
                </div>

                <div className='flex justify-start gap-x-7'>
                  <div className='flex flex-col'>
                    Awards received
                    <input
                      type="text"
                      placeholder='Enter Award received'
                      className='w-[330px] border border-gray-300 rounded-lg px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    />
                  </div>
                  <div className='flex flex-col'>
                    Project / Works
                    <input
                      type="text"
                      placeholder='Enter Project / Works'
                      className='w-[330px] border border-gray-300 rounded-lg px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    />
                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-center">
        <div className='flex-col'>

          <button
            className="flex items-center justify-center w-[1100px] max-w-none border border-[#008A90] rounded-md py-2 px-4 hover:bg-teal-50 transition"
            onClick={addContainer}
          >
            <div className="flex items-center gap-2 text-[#008A90] gap-x-7">
              <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.33333 0.105469V5.10547H10V1.77214H28.3333V20.1055H25V21.7721H30V0.105469H8.33333ZM0 8.4388V30.1055H21.6667V8.4388H0ZM1.66667 10.1055H20V28.4388H1.66667V10.1055ZM10 13.4388V18.4388H5V20.1055H10V25.1055H11.6667V20.1055H16.6667V18.4388H11.6667V13.4388H10Z" fill="#008A91" />
              </svg>
              <span className="text-[#008A90] font-medium">Add Computer-Related Awards</span>
            </div>
          </button>

          <div><Talent /></div>
          <div className='mt-6'><BackNextButt /></div>

        </div>

      </div>


    </div>
  );
};

export default Award;