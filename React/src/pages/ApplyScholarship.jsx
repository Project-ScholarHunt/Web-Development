import React, { useState } from 'react'
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const Apply = () => {
  const [activeTab, setActiveTab] = useState(1);
  // State untuk melacak status dokumen
  const [documents, setDocuments] = useState({
    recommendation_letter: null,
    statement_letter: null,
    grade_transcript: null
  });

  const nextTab = () => {
    if (activeTab < 3) setActiveTab(activeTab + 1);
  };

  const prevTab = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  // Fungsi untuk menghandle file upload
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setDocuments(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  // Check apakah semua dokumen sudah diupload
  const allDocumentsUploaded = () => {
    return documents.recommendation_letter &&
      documents.statement_letter &&
      documents.grade_transcript;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-400 to-teal-500">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-[15vh]">
        <div className="relative inset-0 flex items-center justify-center p-10">

          <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Scholarship Registration Form</h2>
            {/* Steps Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div className={`flex flex-col items-center ${activeTab >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 ${activeTab >= 1 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'}`}>
                    1
                  </div>
                  <span className="text-xs">Personal Info</span>
                </div>
                <div className={`flex-grow h-0.5 ${activeTab >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${activeTab >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 ${activeTab >= 2 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'}`}>
                    2
                  </div>
                  <span className="text-xs">Academic Info</span>
                </div>
                <div className={`flex-grow h-0.5 ${activeTab >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`flex flex-col items-center ${activeTab >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full mb-1 ${activeTab >= 3 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100'}`}>
                    3
                  </div>
                  <span className="text-xs">Documents</span>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              {/* Tab 1: Personal Info */}
              {activeTab === 1 && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">
                      Student ID Number (NIM)
                      <span className="relative inline-block ml-1 group">
                        <i className="ri-information-fill text-gray-400 cursor-pointer"></i>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-600 text-white border border-gray-300 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                          This is the unique student identification number assigned by your university.
                        </div>
                      </span>
                    </label>
                    <input type="text" name="nim" className="w-full border rounded-md p-2" required />
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

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={nextTab}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Tab 2: Academic Info */}
              {activeTab === 2 && (
                <>
                  <div>
                    <label className="block mb-1 font-medium">
                      Next Semester
                      <span className="relative inline-block ml-1 group">
                        <i className="ri-information-fill text-gray-400 cursor-pointer"></i>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-600 text-white border border-gray-300 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                          You will get the scholarship only in the next semester. Make sure you haven't graduated by then.
                        </div>
                      </span>
                    </label>
                    <input type="number" name="semester" className="w-full border rounded-md p-2" required />
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">
                      GPA (GPA / 4.0)
                      <span className="relative inline-block ml-1 group">
                        <i className="ri-information-fill text-gray-400 cursor-pointer"></i>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-gray-600 text-white border border-gray-300 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none">
                          If your university uses a 5.0 GPA scale, convert it to 4.0 (e.g., 4.0/5.0 = 3.2/4.0).
                        </div>
                      </span>
                    </label>
                    <input type="number" step="0.01" name="ipk" className="w-full border rounded-md p-2" required />
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

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={prevTab}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={nextTab}
                      className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                    >
                      Next
                    </button>
                  </div>
                </>
              )}

              {/* Tab 3: Documents */}
              {activeTab === 3 && (
                <>
                  <div>
                    <label className="block mb-1 font-medium">Recommendation letter from your university (.pdf)</label>
                    <label
                      htmlFor="recommendation_letter"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors text-gray-500 text-center p-4"
                    >
                      {documents.recommendation_letter ? (
                        <div className="text-green-500">
                          <i className="ri-check-line text-3xl mb-2"></i>
                          <span className="text-sm">{documents.recommendation_letter.name}</span>
                        </div>
                      ) : (
                        <>
                          <i className="ri-file-text-line text-3xl mb-2"></i>
                          <span className="text-sm">Click or drag your file here</span>
                        </>
                      )}
                      <input
                        id="recommendation_letter"
                        type="file"
                        name="recommendation_letter"
                        className="hidden"
                        required
                        onChange={handleFileChange}
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
                      {documents.statement_letter ? (
                        <div className="text-green-500">
                          <i className="ri-check-line text-3xl mb-2"></i>
                          <span className="text-sm">{documents.statement_letter.name}</span>
                        </div>
                      ) : (
                        <>
                          <i className="ri-file-text-line text-3xl mb-2"></i>
                          <span className="text-sm">Click or drag your file here</span>
                        </>
                      )}
                      <input
                        id="statement_letter"
                        type="file"
                        name="statement_letter"
                        className="hidden"
                        required
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium">Grade transcript (.pdf)</label>
                    <label
                      htmlFor="grade_transcript"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-400 rounded-md cursor-pointer hover:border-blue-500 transition-colors text-gray-500 text-center p-4"
                    >
                      {documents.grade_transcript ? (
                        <div className="text-green-500">
                          <i className="ri-check-line text-3xl mb-2"></i>
                          <span className="text-sm">{documents.grade_transcript.name}</span>
                        </div>
                      ) : (
                        <>
                          <i className="ri-file-text-line text-3xl mb-2"></i>
                          <span className="text-sm">Click or drag your file here</span>
                        </>
                      )}
                      <input
                        id="grade_transcript"
                        type="file"
                        name="grade_transcript"
                        className="hidden"
                        required
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={prevTab}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={!allDocumentsUploaded()}
                      className={`${allDocumentsUploaded()
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-blue-600/50 cursor-not-allowed"
                        } text-white px-6 py-2 rounded transition-all`}
                    >
                      Submit Application
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Apply