import React from 'react';
import { Building2, Users, BarChart } from 'lucide-react';

const Companies = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-gray-700 text-3xl font-medium">Companies</h3>

      {/* Company Stats */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center">
            <Building2 className="h-12 w-12 text-blue-500" />
            <div className="ml-4">
              <h4 className="text-2xl font-semibold text-gray-700">50</h4>
              <p className="text-gray-500">Total Companies</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center">
            <Users className="h-12 w-12 text-green-500" />
            <div className="ml-4">
              <h4 className="text-2xl font-semibold text-gray-700">35</h4>
              <p className="text-gray-500">Actively Recruiting</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex items-center">
            <BarChart className="h-12 w-12 text-purple-500" />
            <div className="ml-4">
              <h4 className="text-2xl font-semibold text-gray-700">15 LPA</h4>
              <p className="text-gray-500">Avg. Package Offered</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company List */}
      <div className="mt-8">
        <h4 className="text-gray-700 text-xl font-medium mb-4">Participating Companies</h4>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Company Name
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Positions Offered
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Avg. Package (LPA)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">TechCorp</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">IT Services</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Software Engineer, Data Analyst</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">12</p>
                </td>
              </tr>
              <tr>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">FinanceHub</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Finance</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">Financial Analyst, Risk Manager</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">14</p>
                </td>
              </tr>
              {/* Add more rows as needed */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Companies;