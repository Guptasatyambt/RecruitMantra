import React, { useState, useEffect } from 'react';
import { GraduationCap, Briefcase, Award, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock data for students
const mockStudents = [
  { id: 1, name: 'Rahul Sharma', course: 'B.Tech (CSE)', year: '4th', cgpa: 8.5, status: 'Placed', company: 'TechCorp', package: 12 },
  { id: 2, name: 'Priya Patel', course: 'M.Tech (AI)', year: '2nd', cgpa: 9.2, status: 'Placed', company: 'DataSys Inc.', package: 15 },
  { id: 3, name: 'Amit Kumar', course: 'B.Tech (ECE)', year: '4th', cgpa: 7.8, status: 'Not Placed', company: '-', package: 0 },
  { id: 4, name: 'Sneha Gupta', course: 'B.Tech (IT)', year: '4th', cgpa: 8.9, status: 'Placed', company: 'InnovateX', package: 14 },
  { id: 5, name: 'Rajesh Singh', course: 'M.Tech (CSE)', year: '2nd', cgpa: 8.7, status: 'Placed', company: 'TechGiant', package: 18 },
  // Add more mock students as needed
];

const Students = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(5);

  // Filter students based on search term and status
  useEffect(() => {
    const filteredStudents = mockStudents.filter(student => 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'All' || student.status === filterStatus)
    );
    setStudents(filteredStudents);
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  // Pagination
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium">Students</h3>

      {/* Student Stats */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center">
            <GraduationCap className="h-12 w-12 text-blue-500" />
            <div className="ml-4">
              <h4 className="text-2xl font-semibold text-gray-700">{mockStudents.length}</h4>
              <p className="text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center">
            <Briefcase className="h-12 w-12 text-green-500" />
            <div className="ml-4">
              <h4 className="text-2xl font-semibold text-gray-700">
                {mockStudents.filter(s => s.status === 'Placed').length}
              </h4>
              <p className="text-gray-500">Placed Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center">
            <Award className="h-12 w-12 text-yellow-500" />
            <div className="ml-4">
              <h4 className="text-2xl font-semibold text-gray-700">
                {Math.max(...mockStudents.map(s => s.package))} LPA
              </h4>
              <p className="text-gray-500">Highest Package</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
        <div className="w-full sm:w-1/3 relative">
          <input
            type="text"
            placeholder="Search students..."
            className="w-full p-2 pl-8 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Students</option>
            <option value="Placed">Placed</option>
            <option value="Not Placed">Not Placed</option>
          </select>
        </div>
      </div>

      {/* Student List */}
      <div className="mt-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  CGPA
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Package (LPA)
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.name}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.course}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.year}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.cgpa}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span className={`relative inline-block px-3 py-1 font-semibold ${
                      student.status === 'Placed' ? 'text-green-900' : 'text-red-900'
                    } leading-tight`}>
                      <span aria-hidden className={`absolute inset-0 ${
                        student.status === 'Placed' ? 'bg-green-200' : 'bg-red-200'
                      } opacity-50 rounded-full`}></span>
                      <span className="relative">{student.status}</span>
                    </span>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.company}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{student.package}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstStudent + 1}</span> to{' '}
            <span className="font-medium">{Math.min(indexOfLastStudent, students.length)}</span> of{' '}
            <span className="font-medium">{students.length}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            {Array.from({ length: Math.ceil(students.length / studentsPerPage) }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  currentPage === index + 1
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(students.length / studentsPerPage)}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Students;