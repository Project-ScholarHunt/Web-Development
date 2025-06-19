import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
import axios from 'axios';
import { alertSuccess } from '../lib/alert';

// Data Provinsi dan Kota Indonesia
const provincesAndCities = {
  "Aceh": ["Banda Aceh", "Langsa", "Lhokseumawe", "Sabang", "Meulaboh", "Bireuen", "Takengon"],
  "Sumatera Utara": ["Medan", "Binjai", "Pematangsiantar", "Tanjungbalai", "Sibolga", "Tebing Tinggi", "Padang Sidempuan"],
  "Sumatera Barat": ["Padang", "Bukittinggi", "Payakumbuh", "Solok", "Sawahlunto", "Padang Panjang", "Pariaman"],
  "Riau": ["Pekanbaru", "Dumai", "Siak", "Kampar", "Rokan Hulu", "Bengkalis", "Indragiri Hilir"],
  "Kepulauan Riau": ["Batam", "Tanjung Pinang", "Bintan", "Karimun", "Lingga", "Natuna", "Anambas"],
  "Jambi": ["Jambi", "Sungai Penuh", "Muaro Jambi", "Batanghari", "Tanjung Jabung Timur", "Tanjung Jabung Barat"],
  "Sumatera Selatan": ["Palembang", "Lubuklinggau", "Pagar Alam", "Prabumulih", "Ogan Komering Ulu", "Lahat"],
  "Kepulauan Bangka Belitung": ["Pangkal Pinang", "Belitung", "Bangka", "Bangka Barat", "Bangka Tengah", "Bangka Selatan"],
  "Bengkulu": ["Bengkulu", "Rejang Lebong", "Kaur", "Seluma", "Mukomuko", "Lebong"],
  "Lampung": ["Bandar Lampung", "Metro", "Lampung Selatan", "Lampung Tengah", "Lampung Utara", "Lampung Barat"],
  "DKI Jakarta": ["Jakarta Pusat", "Jakarta Utara", "Jakarta Barat", "Jakarta Selatan", "Jakarta Timur", "Kepulauan Seribu"],
  "Jawa Barat": ["Bandung", "Bogor", "Depok", "Bekasi", "Cimahi", "Tasikmalaya", "Banjar", "Sukabumi", "Cirebon"],
  "Jawa Tengah": ["Semarang", "Solo", "Magelang", "Salatiga", "Pekalongan", "Tegal", "Surakarta", "Yogyakarta"],
  "DI Yogyakarta": ["Yogyakarta", "Sleman", "Bantul", "Gunungkidul", "Kulon Progo"],
  "Jawa Timur": ["Surabaya", "Malang", "Banyuwangi", "Mojokerto", "Pasuruan", "Probolinggo", "Madiun", "Kediri", "Blitar"],
  "Banten": ["Serang", "Tangerang", "Cilegon", "Tangerang Selatan", "Lebak", "Pandeglang"],
  "Bali": ["Denpasar", "Badung", "Gianyar", "Karangasem", "Klungkung", "Bangli", "Jembrana", "Buleleng", "Tabanan"],
  "Nusa Tenggara Barat": ["Mataram", "Bima", "Sumbawa", "Dompu", "Lombok Barat", "Lombok Tengah", "Lombok Timur"],
  "Nusa Tenggara Timur": ["Kupang", "Ende", "Flores", "Manggarai", "Sumba Timur", "Sumba Barat", "Timor Tengah Selatan"],
  "Kalimantan Barat": ["Pontianak", "Singkawang", "Sambas", "Ketapang", "Sintang", "Putussibau"],
  "Kalimantan Tengah": ["Palangkaraya", "Kotawaringin Barat", "Kotawaringin Timur", "Kapuas", "Barito Selatan"],
  "Kalimantan Selatan": ["Banjarmasin", "Banjarbaru", "Martapura", "Barito Kuala", "Tanah Laut", "Kotabaru"],
  "Kalimantan Timur": ["Samarinda", "Balikpapan", "Bontang", "Kutai Kartanegara", "Kutai Barat", "Kutai Timur"],
  "Kalimantan Utara": ["Tarakan", "Bulungan", "Malinau", "Nunukan", "Tana Tidung"],
  "Sulawesi Utara": ["Manado", "Bitung", "Tomohon", "Kotamobagu", "Minahasa", "Kepulauan Sangihe"],
  "Sulawesi Tengah": ["Palu", "Donggala", "Toli-Toli", "Buol", "Parigi Moutong", "Tojo Una-Una"],
  "Sulawesi Selatan": ["Makassar", "Parepare", "Palopo", "Gowa", "Takalar", "Jeneponto", "Bantaeng"],
  "Sulawesi Tenggara": ["Kendari", "Baubau", "Konawe", "Kolaka", "Konawe Selatan", "Bombana"],
  "Gorontalo": ["Gorontalo", "Limboto", "Marisa", "Tilamuta", "Kwandang"],
  "Sulawesi Barat": ["Mamuju", "Polewali Mandar", "Majene", "Mamasa", "Pasangkayu"],
  "Maluku": ["Ambon", "Maluku Tengah", "Buru", "Kepulauan Aru", "Seram Bagian Barat"],
  "Maluku Utara": ["Ternate", "Tidore", "Halmahera", "Kepulauan Sula", "Halmahera Selatan"],
  "Papua": ["Jayapura", "Merauke", "Sorong", "Manokwari", "Nabire", "Wamena", "Timika"],
  "Papua Barat": ["Manokwari", "Sorong", "Raja Ampat", "Fakfak", "Kaimana", "Teluk Bintuni"]
};

const Apply = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [documents, setDocuments] = useState({
    recommendation_letter: null,
    statement_letter: null,
    grade_transcript: null,
  });
  const [formData, setFormData] = useState({
    fullname: '',
    nim: '',
    semester: '',
    university: '',
    major: '',
    ipk: '',
    city: '',
    province: '',
    postal_code: '',
    address: '',
  });
  const [provinces] = useState(Object.keys(provincesAndCities));
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const scholarshipId = queryParams.get('scholarship_id');

  useEffect(() => {
    document.title = 'Apply Scholarship';
    if (!scholarshipId) {
      setError('No scholarship selected. Please select a scholarship to apply for.');
    }
  }, [scholarshipId]);

  const nextTab = () => {
    if (activeTab < 3) setActiveTab(activeTab + 1);
  };

  const prevTab = () => {
    if (activeTab > 1) setActiveTab(activeTab - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData(prev => ({
      ...prev,
      province: selectedProvince,
      city: '' // Reset city when province changes
    }));
    setCities(provincesAndCities[selectedProvince] || []);
  };

  const handleCityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      city: e.target.value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      // Validate file type and size (PDF, max 2MB)
      if (file.type !== 'application/pdf') {
        setError(`${name.replace('_', ' ')} must be a PDF file.`);
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError(`${name.replace('_', ' ')} must not exceed 2MB.`);
        return;
      }
      setDocuments((prev) => ({
        ...prev,
        [name]: file,
      }));
      setError(null); // Clear any previous errors
    }
  };

  const allDocumentsUploaded = () => {
    return documents.recommendation_letter &&
      documents.statement_letter &&
      documents.grade_transcript;
  };

  const validateFormData = () => {
    // Validate IPK range
    const ipk = parseFloat(formData.ipk);
    if (isNaN(ipk) || ipk < 0 || ipk > 4.0) {
      setError('GPA (IPK) must be between 0 and 4.0.');
      return false;
    }
    // Validate semester
    const semester = parseInt(formData.semester);
    if (isNaN(semester) || semester < 1) {
      setError('Semester must be a positive number.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Validate scholarship ID
    if (!scholarshipId) {
      setError('Scholarship ID is missing.');
      return;
    }

    // Validate documents
    if (!allDocumentsUploaded()) {
      setError('Please upload all required documents.');
      return;
    }

    // Validate form data
    if (!validateFormData()) {
      return;
    }

    // Validate token
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to submit an application.');
      return;
    }

    // Prepare form data for submission
    const formDataToSend = new FormData();
    formDataToSend.append('scholarship_id', scholarshipId);
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    Object.keys(documents).forEach((key) => {
      if (documents[key]) {
        formDataToSend.append(key, documents[key]);
      }
    });

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/apply', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccess(response.data.message);
      alertSuccess(response.data.message);
      setError(null);
      setTimeout(() => {
        navigate(`/scholarships?id=${scholarshipId}`, { state: { refresh: true } });
      }, 2000);
    } catch (err) {
      console.error('Error submitting application:', err);
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
      setSuccess(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Navbar />
      <main className="flex-grow container mx-auto px-6 py-[15vh]">
        <div className="relative inset-0 flex items-center justify-center p-10">
          <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Scholarship Registration Form</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                {success}
              </div>
            )}

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

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 1 && (
                <>
                  <div>
                    <label className="block mb-1 font-medium">Your full name according to your National Identity Card (KTP)</label>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
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
                    <input
                      type="number"
                      name="nim"
                      value={formData.nim}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">University</label>
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Major (e.g., Electrical Engineering)</label>
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Province</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleProvinceChange}
                      className="w-full border rounded-md p-2"
                      required
                    >
                      <option value="">Select Province</option>
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleCityChange}
                      className="w-full border rounded-md p-2"
                      required
                      disabled={!formData.province} // Disable if no province is selected
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-1 font-medium">Postal Code</label>
                    <input
                      type="number"
                      name="postal_code"
                      value={formData.postal_code}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Address</label>
                    <textarea
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    ></textarea>
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

              {activeTab === 2 && (
                <>
                  <div>
                    <label className="block mb-1 font-medium">Next Semester</label>
                    <input
                      type="number"
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">GPA (GPA / 4.0)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="ipk"
                      value={formData.ipk}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                      required
                    />
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
                        accept="application/pdf" // Restrict to PDF files
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Statement letter (.pdf)</label>
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
                        accept="application/pdf"
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
                        accept="application/pdf"
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
  );
};

export default Apply;
