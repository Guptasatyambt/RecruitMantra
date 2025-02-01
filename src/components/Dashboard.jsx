import React, { useState } from 'react';
import { BarChart, Users, Briefcase, Menu } from 'lucide-react';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-indigo-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <a href="#" className="text-white flex items-center space-x-2 px-4">
          <Briefcase className="w-8 h-8" />
          <span className="text-2xl font-extrabold">PlaceMe</span>
        </a>
        <nav>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 hover:text-white">
            Dashboard
          </a>
          <a href="/companies" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 hover:text-white">
            Companies
          </a>
          <a href="/students" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 hover:text-white">
            Students
          </a>
          <a href="#" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-indigo-700 hover:text-white">
            Statistics
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-md">
          <div className="flex items-center justify-between p-4">
            <button onClick={toggleSidebar} className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Placement Cell Dashboard</h2>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <h3 className="text-gray-700 text-3xl font-medium">Dashboard</h3>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                  <Briefcase className="h-12 w-12 text-indigo-500" />
                  <div className="ml-4">
                    <h4 className="text-2xl font-semibold text-gray-700">42</h4>
                    <p className="text-gray-500">Companies Visited</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="h-12 w-12 text-green-500" />
                  <div className="ml-4">
                    <h4 className="text-2xl font-semibold text-gray-700">189</h4>
                    <p className="text-gray-500">Students Placed</p>
                  </div>
                </div>
              </div>
              <div className="bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center">
                  <BarChart className="h-12 w-12 text-yellow-500" />
                  <div className="ml-4">
                    <h4 className="text-2xl font-semibold text-gray-700">85%</h4>
                    <p className="text-gray-500">Placement Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Placements */}
            <div className="mt-8">
              <h4 className="text-gray-700 text-xl font-medium mb-4">Recent Placements</h4>
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                  <thead>
                    <tr>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Package (LPA)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">Rahul Sharma</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">TechCorp</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">Software Engineer</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">12</p>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">Priya Patel</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">DataSys Inc.</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">Data Analyst</p>
                      </td>
                      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">9.5</p>
                      </td>
                    </tr>
                    {/* Add more rows as needed */}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Placement Trend Chart (Placeholder) */}
            <div className="mt-8">
              <h4 className="text-gray-700 text-xl font-medium mb-4">Placement Trends</h4>
              <div className="bg-white shadow-lg rounded-lg p-4">
                <div className="h-64 bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">Placement Trend Chart (Placeholder)</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;