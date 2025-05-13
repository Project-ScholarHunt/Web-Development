import React from 'react'

const Apply = () => {
  return (
    <div className="relative inset-0 bg-gray-200 flex items-center justify-center p-10">
      <div className="w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg z-100">
        <h2 className="text-2xl font-bold mb-6">Scholarship Registration Form</h2>
        <form className="space-y-4">
          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Student ID Number (NIM)
              <span className="relative inline-block ml-1 group">
                <i className="ri-information-fill text-gray-400 cursor-pointer"></i>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-600 text-white border border-gray-300 rounded shadow-lg text-sm  opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  This is the unique student identification number assigned by your university.
                </div>
              </span>
            </label>
            <input type="text" name="nim" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Next Semester
              <span className="relative inline-block ml-1 group">
                <i className="ri-information-fill text-gray-400 cursor-pointer"></i>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-600 text-white border border-gray-300 rounded shadow-lg text-sm  opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  You will get the scholarship only in the next semester. Make sure you haven't graduated by then.
                </div>
              </span>
            </label>
            <input type="number" name="semester" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">University</label>
            <input type="text" name="university" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Major (e.g., Electrical Engineering)</label>
            <input type="text" name="major" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              GPA (GPA / 4.0)
              <span className="relative inline-block ml-1 group">
                <i className="ri-information-fill text-gray-400 cursor-pointer"></i>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-600 text-white border border-gray-300 rounded shadow-lg text-sm  opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  If your university uses a 5.0 GPA scale, convert it to 4.0 (e.g., 4.0/5.0 = 3.2/4.0).
                </div>
              </span>
            </label>
            <input type="number" step="0.01" name="ipk" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">Recommendation letter from your university (.pdf)</label>
            <label
              htmlFor="recommendation_letter"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors text-gray-500 text-center p-4"
            >
              <i className="ri-file-text-line text-3xl mb-2"></i>
              <span className="text-sm">Click or drag your file here</span>
              <input
                id="recommendation_letter"
                type="file"
                name="recommendation_letter"
                className="hidden"
                required
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">
              Statement letter (.pdf)
              <span className="relative inline-block ml-1 group">
                <i className="ri-information-fill text-gray-400 cursor-pointer"></i>

                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-600 text-white border border-gray-300 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                  Statement letter that confirms you are not receiving any other scholarship and that all form information is accurate.
                </div>
              </span>
            </label>

            <label
              htmlFor="statement_letter"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors text-gray-500 text-center p-4"
            >
              <i className="ri-file-text-line text-3xl mb-2"></i>
              <span className="text-sm">Click or drag your file here</span>
              <input
                id="statement_letter"
                type="file"
                name="statement_letter"
                className="hidden"
                required
              />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">Grade transcript (.pdf)</label>
            <label
              htmlFor="grade_transcript"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors text-gray-500 text-center p-4"
            >
              <i className="ri-file-text-line text-3xl mb-2"></i>
              <span className="text-sm">Click or drag your file here</span>
              <input
                id="grade_transcript"
                type="file"
                name="grade_transcript"
                className="hidden"
                required
              />
            </label>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              City <span className="text-sm text-gray-500">(according to your National Identity Card - KTP)</span>
            </label>
            <input type="text" name="city" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Province <span className="text-sm text-gray-500">(according to your National Identity Card - KTP)</span>
            </label>
            <input type="text" name="province" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Postal Code <span className="text-sm text-gray-500">(according to your National Identity Card - KTP)</span>
            </label>
            <input type="text" name="postal_code" className="w-full border rounded-md p-2" required />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Address <span className="text-sm text-gray-500">(according to your National Identity Card - KTP)</span>
            </label>
            <textarea name="address" rows="3" className="w-full border rounded-md p-2" required></textarea>
          </div>

          <button type="submit" className="bg-blue-600 w-full hover:cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div >
    </div >
  )
}

export default Apply