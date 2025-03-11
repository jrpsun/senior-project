import React from 'react';
import FileUpload from '@components/components/FileUpload';
import BackNextButt from '@components/components/BackNextButt'

const AdditionalDocuments = () => {
  return (
    <>


      <div className="flex justify-center pt-10 bg-[#FFFFFF] min-h-screen p-6">
        <div className="w-[1100px] max-w-none bg-white rounded-lg p-6 border border-gray-300">
          <h1 className="text-2xl font-semibold text-[#008A90] mb-4">
            Additional Documents
          </h1>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">Statement of Purpose<span className='text-[#D92D20]'> *</span></h2>
            <div className="text-[#B3B3B3] mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                  </svg>
                  <span>
                    Upload an essay on the topic "Why pursue studies in IT and Computer Science, and how to apply this knowledge in the future?"
                    <br />(Maximum 1 A4 page, in Thai or English, PDF format, up to 5 MB)
                  </span>
                </div>
              </div>
            </div>
            <br />
            <FileUpload />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">Portfolio<span className='text-[#D92D20]'> *</span></h2>

            <div className="text-[#B3B3B3] mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                  </svg>
                  <span>
                    Upload your portfolio
                    <br />(Maximum 1 file up to 10 pages, in Thai or English, PDF format, up to 5 MB)
                  </span>
                </div>
              </div>
            </div>

            <br />
            <FileUpload />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">Video<span className='text-[#D92D20]'> *</span></h2>

            <div className="text-[#B3B3B3] mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                  </svg>
                  <span>
                    Please provide the URL of the video introducting yourself and your achievements
                    <br />(file format .mp4 maximum length: 3 minutes. in English, uploaded to Youtube or Google Drive)
                  </span>
                </div>
              </div>
            </div>

            <br />
            <input
              type="text"
              placeholder="Enter Google Drive or YouTube link"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">Resume</h2>

            <div className="text-[#B3B3B3] mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                  </svg>
                  <span>
                    Upload your resume
                    <br />(1 file per submission, in Thai or English, PDF format, up to 5 MB)
                  </span>
                </div>
              </div>
            </div>

            <br />
            <FileUpload />
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-800">Other Documents (if any)</h2>

            <div className="text-[#B3B3B3] mt-2">
              <div className="flex flex-col">
                <div className="flex items-baseline space-x-2">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10.0804 0.0176134C4.55191 0.003686 0.044976 4.46514 0.0137688 9.98192C-0.0174547 15.5105 4.42992 20.0035 9.94663 20.0175C15.4752 20.0314 19.9821 15.5699 20.0133 10.0531C20.0563 4.52454 15.5971 0.0315615 10.0804 0.0176134ZM9.93497 2.71126C10.4193 2.71041 10.8207 2.8869 11.151 3.2289C11.4931 3.55907 11.658 3.97224 11.6573 4.45658C11.6566 4.94092 11.4907 5.34285 11.1476 5.68604C10.8164 6.01738 10.4027 6.18349 9.9302 6.18432C9.43405 6.18519 9.03263 6.02051 8.6905 5.69035C8.36019 5.36016 8.18356 4.94701 8.18422 4.46267C8.1849 3.96652 8.36265 3.56456 8.70569 3.23319C9.03693 2.89003 9.45063 2.71211 9.93497 2.71126ZM7.10548 7.19339L11.7008 7.18533L11.689 15.7499L13.0712 15.7474L13.0696 16.8461L7.0922 16.8565L7.09371 15.7579L8.46403 15.7555L8.47429 8.28961L7.10397 8.29202L7.10548 7.19339Z" fill="#008A91" />
                  </svg>
                  <span>
                    Upload other relevant document such as cerificates of educational qualifications, documents showing residence status in Thailand (Visa/Work Permit), etc.
                    <br />(1 file per submission, in Thai or English, PDF format, up to 5 MB)
                  </span>
                </div>
              </div>
            </div>

            <br />
            <FileUpload />
          </div>

        </div>
      </div>

      <div className='flex justify-center'>
        <div className='mt-6'><BackNextButt /></div>
      </div>

    </>
  );
};

export default AdditionalDocuments;