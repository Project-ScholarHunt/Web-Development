import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CrudScholarshipForm from './CrudScholarshipForm';
import CrudScholarshipTable from './CrudScholarshipTable';
import ScholarshipApplicants from './ScholarshipApplicants';
import { alertConfirm, alertError, alertSuccess } from '../lib/alert';

const AdminScholarships = () => {
    const [scholarships, setScholarships] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        scholarshipName: '',
        partner: '',
        description: '',
        termsAndConditions: '',
        quota: '',
        timeLimit: '',
        logo: null,
        thumbnail: null,
        logoUrl: '',
        thumbnailUrl: ''
    });
    const [viewingApplicantsForId, setViewingApplicantsForId] = useState(null);

    const API_BASE_URL = 'http://localhost:8000/api';

    const fetchScholarships = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/scholarships`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            setScholarships(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching scholarships:', err);
            setError('Failed to load scholarships. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchScholarships();
    }, []);

    const filteredScholarships = scholarships.filter(scholarship =>
        scholarship.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.partner.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({
            ...formData,
            [name]: files[0]
        });
    };

    const resetForm = () => {
        setFormData({
            scholarshipName: '',
            partner: '',
            description: '',
            termsAndConditions: '',
            quota: '',
            timeLimit: '',
            logo: null,
            thumbnail: null,
            logoUrl: '',
            thumbnailUrl: ''
        });
        setIsEditing(false);
        setEditId(null);

        const logoInput = document.getElementById('logoInput');
        const thumbnailInput = document.getElementById('thumbnailInput');
        if (logoInput) logoInput.value = '';
        if (thumbnailInput) thumbnailInput.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const formDataObj = new FormData();

        formDataObj.append('scholarshipName', formData.scholarshipName);
        formDataObj.append('partner', formData.partner);
        formDataObj.append('description', formData.description);
        formDataObj.append('termsAndConditions', formData.termsAndConditions);
        formDataObj.append('quota', formData.quota);
        formDataObj.append('timeLimit', formData.timeLimit);

        if (formData.logo instanceof File) {
            formDataObj.append('logo', formData.logo);
        }

        if (formData.thumbnail instanceof File) {
            formDataObj.append('thumbnail', formData.thumbnail);
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Authentication token not found');
            }

            let response;

            if (isEditing && editId) {
                response = await axios({
                    method: 'post',
                    url: `${API_BASE_URL}/scholarships/${editId}`,
                    data: formDataObj,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                        'Accept': 'application/json',
                        'X-HTTP-Method-Override': 'PUT'
                    }
                });
                alertSuccess('Scholarship updated successfully!');
            } else {
                response = await axios.post(
                    `${API_BASE_URL}/scholarships`,
                    formDataObj,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data',
                            'Accept': 'application/json'
                        }
                    }
                );
                alertSuccess('Scholarship created successfully!');
            }

            resetForm();

            fetchScholarships();
        } catch (err) {
            console.error('Error submitting form:', err);
            alertError(err.message)

            if (err.response) {
                if (err.response.data && err.response.data.errors) {
                    const errorMessages = Object.values(err.response.data.errors).flat();
                    setError(`Validation error: ${errorMessages.join(', ')}`);
                } else if (err.response.data && err.response.data.error) {
                    setError(err.response.data.error);
                } else {
                    setError(`Server error (${err.response.status}): Please try again later.`);
                }
            } else if (err.request) {
                setError('Network error: No response received from server. Please check your connection.');
            } else {
                setError(`Error: ${err.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = async (scholarship) => {
        if (!scholarship || !scholarship.id) {
            console.error('Invalid scholarship object:', scholarship);
            setError('Failed to load scholarship details: Invalid scholarship data.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/scholarships/${scholarship.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });

            const scholarshipData = response.data;

            setIsEditing(true);
            setEditId(scholarshipData.id);

            let formattedDate = '';
            if (scholarshipData.timeLimit) {
                formattedDate = scholarshipData.timeLimit.split('T')[0];
            }

            setFormData({
                scholarshipName: scholarshipData.scholarshipName || '',
                partner: scholarshipData.partner || '',
                description: scholarshipData.description || '',
                termsAndConditions: scholarshipData.termsAndConditions || '',
                quota: scholarshipData.quota || '',
                timeLimit: formattedDate,
                logo: null,
                thumbnail: null,
                logoUrl: scholarshipData.logo || '',
                thumbnailUrl: scholarshipData.thumbnail || ''
            });

            setError(null);
        } catch (err) {
            console.error('Error fetching scholarship details:', err);
            setError('Failed to load scholarship details for editing.');
        } finally {
            setIsLoading(false);

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    const handleDelete = async (id) => {
        if (!await alertConfirm('Are you sure you want to delete this scholarship?')) {
            return;
        }
        if (!id) {
            console.error('Invalid scholarship ID for deletion');
            return;
        }
        try {
            await axios.delete(`${API_BASE_URL}/scholarships/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });
            fetchScholarships();
            alertSuccess('Scholarship deleted successfully');
        } catch (err) {
            console.error('Error deleting scholarship:', err);
            alertError('Failed to delete scholarship. Please try again.');
        }
    };

    const handleViewApplicants = (scholarshipId) => {
        console.log("Viewing applicants for scholarship ID:", scholarshipId);
        setViewingApplicantsForId(scholarshipId);
    };

    const handleBackToScholarshipList = () => {
        setViewingApplicantsForId(null);
    };

    if (viewingApplicantsForId) {
        return (
            <ScholarshipApplicants
                scholarshipId={viewingApplicantsForId}
                onBack={handleBackToScholarshipList}
            />
        );
    }


    return (
        <div>
            <h1 className="text-2xl font-semibold mb-4">Manage Scholarships</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    <p>{error}</p>
                </div>
            )}

            {isLoading && (
                <div className="text-center my-4">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                    <p className="mt-2">Loading...</p>
                </div>
            )}

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search scholarships..."
                    className="w-full p-2 border border-gray-300 rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <CrudScholarshipForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleFileChange={handleFileChange}
                handleSubmit={handleSubmit}
                resetForm={resetForm}
                isEditing={isEditing}
                isSubmitting={isSubmitting}
            />

            <CrudScholarshipTable
                items={filteredScholarships}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                isLoading={isLoading}
                onViewApplicants={handleViewApplicants}
            />
        </div>
    );
};

export default AdminScholarships;