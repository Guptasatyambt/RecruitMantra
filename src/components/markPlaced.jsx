import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { companyAPI } from '../services/api';
import { collegeadminAPI } from '../services/collegeadminAPI';

function CompanyForm({ onClose, selectedStudent }) {
    const [companies, setCompanies] = useState([]);
    const [companyNameInput, setCompanyNameInput] = useState('');
    const [ctc, setCtc] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [formError, setFormError] = useState('');
    // Fetch companies on mount
    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await companyAPI.getOverAllCompanies()
                let sortedCompanies = res.data.data;

                setCompanies(sortedCompanies);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        }

        fetchCompanies();
    },[]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            // Check if the company already exists
            let existingCompany = companies.find(
                (comp) => comp.company_name.toLowerCase() === companyNameInput.trim().toLowerCase()
            );

            let companyId = null;

            if (existingCompany) {
                companyId = existingCompany._id;
            } else {
                // Add new company

                const addRes = await axios.post('https://api.recruitmantra.com/company/add', {
                    company_name: companyNameInput.trim(),
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                companyId = addRes.data.data._id;

                // Optionally update local state
                setCompanies([...companies, addRes.data.data]);
            }
            console.log(selectedStudent)
            setSelectedCompanyId(companyId);
            const data = {
                student_id:selectedStudent,
                company_id:companyId,
                ctc:ctc,
                
            };
            console.log(data)
            // Final API call
            const response = await collegeadminAPI.markStudentHired(data)
           setCompanyNameInput('');
    setCtc('');
    if (onClose) onClose();
        } catch (error) {
            console.error('Submission failed:', error);
            setFormError(error.response?.data?.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                {formError && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                        {formError}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="max-w-3xl h-[80vh] overflow-y-auto mx-auto bg-white rounded shadow mt-10">
                    <h2 className="text-xl font-bold mb-4">Mark Student Placed</h2>
                    <div className="mb-4">
                        <label className="block font-medium mb-1">Company Name</label>
                        <input
                            type="text"
                            value={companyNameInput}
                            onChange={(e) => setCompanyNameInput(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            list="company-list"
                            required
                        />
                        <datalist id="company-list">
                            {companies.map((company) => (
                                <option key={company._id} value={company.company_name} />
                            ))}
                        </datalist>
                    </div>

                    <div className="mb-4">
                        <label className="block font-medium mb-1">CTC</label>
                        <input
                            type="text"
                            value={ctc}
                            onChange={(e) => setCtc(e.target.value)}
                            className="w-full border px-3 py-2 rounded"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CompanyForm;
