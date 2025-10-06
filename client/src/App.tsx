import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Calendar, Users, Target, Award, TrendingUp } from 'lucide-react';

// Sample data structure based on your spreadsheet
const initialPlanters = [
  {
    id: 1,
    firstName: "Luis",
    lastName: "Sanchez",
    phone: "816-724-7799",
    email: "luisf526@gmail.com",
    fieldStaffRep: "Marrs",
    church: "Northland en Espanol",
    careStart: "2020-10-01",
    endDate: "2025-09-30",
    stage: "CARE",
    status: "Active Care",
    funding: 1000,
    training: 2019,
    sendingChurch: "Northland",
    spouseFirst: "Nohemi",
    spouseLast: "Sanchez",
    orientation: "2019-10-28"
  },
  {
    id: 2,
    firstName: "Stephen",
    lastName: "Daniel",
    phone: "817-689-8537",
    email: "stephen.daniel1988@gmail.com",
    fieldStaffRep: "Marrs",
    church: "RiverPark Church",
    careStart: "2021-01-01",
    endDate: "2025-12-31",
    stage: "CARE",
    status: "Active Care",
    funding: 1500,
    training: 2021,
    sendingChurch: "PV",
    spouseFirst: "Hannah",
    spouseLast: "Daniel",
    orientation: "2019-10-28"
  },
  {
    id: 3,
    firstName: "Taylor",
    lastName: "DiRoberto",
    phone: "636-577-0816",
    email: "taylordiroberto@gmail.com",
    fieldStaffRep: "Marrs",
    church: "Northside Fellowship",
    careStart: "2021-04-01",
    endDate: "2026-03-31",
    stage: "CARE",
    status: "Active Care",
    funding: 1000,
    training: 2020,
    sendingChurch: "Northland",
    spouseFirst: "Sara",
    spouseLast: "DiRoberto",
    orientation: "2020-11-01"
  },
  {
    id: 4,
    firstName: "Alan",
    lastName: "Findley",
    phone: "816-289-2057",
    email: "alan@overflowchurch.net",
    fieldStaffRep: "Partin",
    church: "Overflow Church",
    careStart: "2021-09-01",
    endDate: "2026-08-31",
    stage: "EQUIP",
    status: "Active Care",
    funding: 1500,
    training: 2021,
    sendingChurch: "Summit Woods",
    spouseFirst: "Mandi",
    spouseLast: "Findley",
    orientation: "2021-02-01"
  },
  {
    id: 5,
    firstName: "Fataki",
    lastName: "Mutambala",
    phone: "573-639-7746",
    email: "fmutambala@gmail.com",
    fieldStaffRep: "Marrs",
    church: "Yesu Ni Jibu Church",
    careStart: "2021-10-01",
    endDate: "2026-09-30",
    stage: "CARE",
    status: "Active Care",
    funding: 1000,
    training: null,
    sendingChurch: "Antioch",
    spouseFirst: "Zita",
    spouseLast: "Mutambala",
    orientation: "2021-10-01"
  },
  {
    id: 6,
    firstName: "Arturo",
    lastName: "Nunez",
    phone: "913-991-7400",
    email: "arturo@misionesperanza.com",
    fieldStaffRep: "Partin",
    church: "Mision Esperanza",
    careStart: "2021-11-01",
    endDate: "2026-10-31",
    stage: "EQUIP",
    status: "Active Care",
    funding: 1500,
    training: null,
    sendingChurch: "Summit Woods",
    spouseFirst: "Araceli",
    spouseLast: "Nunez",
    orientation: "2021-11-01"
  },
  {
    id: 7,
    firstName: "John",
    lastName: "Smith",
    phone: "816-555-0001",
    email: "john.smith@example.com",
    fieldStaffRep: "Marrs",
    church: "New Hope Church",
    careStart: null,
    endDate: null,
    stage: "PREPARE",
    status: "New 2025",
    funding: 0,
    training: null,
    sendingChurch: "Northland",
    spouseFirst: "Jane",
    spouseLast: "Smith",
    orientation: null
  },
  {
    id: 8,
    firstName: "Maria",
    lastName: "Garcia",
    phone: "913-555-0002",
    email: "maria.garcia@example.com",
    fieldStaffRep: "Partin",
    church: "Casa de Dios",
    careStart: null,
    endDate: null,
    stage: "ASSESS",
    status: "Potential",
    funding: 0,
    training: null,
    sendingChurch: "Summit Woods",
    spouseFirst: "Carlos",
    spouseLast: "Garcia",
    orientation: null
  },
  {
    id: 9,
    firstName: "David",
    lastName: "Johnson",
    phone: "816-555-0003",
    email: "david.j@example.com",
    fieldStaffRep: "Marrs",
    church: "City Light Church",
    careStart: "2024-01-01",
    endDate: "2028-12-31",
    stage: "EQUIP",
    status: "New 2025",
    funding: 1300,
    training: 2024,
    sendingChurch: "PV",
    spouseFirst: "Lisa",
    spouseLast: "Johnson",
    orientation: "2024-01-15"
  },
  {
    id: 10,
    firstName: "Michael",
    lastName: "Brown",
    phone: "913-555-0004",
    email: "m.brown@example.com",
    fieldStaffRep: "Partin",
    church: "Faith Community",
    careStart: null,
    endDate: null,
    stage: "PREPARE",
    status: "Potential",
    funding: 0,
    training: null,
    sendingChurch: "Antioch",
    spouseFirst: "Sarah",
    spouseLast: "Brown",
    orientation: null
  }
];

function App() {
  const [planters, setPlanters] = useState(initialPlanters);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRep, setFilterRep] = useState('All Reps');
  const [filterStatus, setFilterStatus] = useState('All Status');
  const [filterStage, setFilterStage] = useState('All Stages');
  const [selectedPlanter, setSelectedPlanter] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPlanters = planters.length;
    const activeCare = planters.filter(p => p.status === "Active Care").length;
    const new2025 = planters.filter(p => p.status === "New 2025").length;
    const potential = planters.filter(p => p.status === "Potential").length;
    const uniqueReps = new Set(planters.map(p => p.fieldStaffRep)).size;
    
    return { totalPlanters, activeCare, new2025, potential, uniqueReps };
  }, [planters]);

  // Filter planters
  const filteredPlanters = useMemo(() => {
    return planters.filter(planter => {
      const matchesSearch = 
        planter.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planter.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planter.church.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRep = filterRep === 'All Reps' || planter.fieldStaffRep === filterRep;
      const matchesStatus = filterStatus === 'All Status' || planter.status === filterStatus;
      const matchesStage = filterStage === 'All Stages' || planter.stage === filterStage;
      
      return matchesSearch && matchesRep && matchesStatus && matchesStage;
    });
  }, [planters, searchTerm, filterRep, filterStatus, filterStage]);

  // Get unique values for filters
  const uniqueReps = [...new Set(planters.map(p => p.fieldStaffRep))];
  const uniqueStatuses = [...new Set(planters.map(p => p.status))];
  const stages = ['PREPARE', 'ASSESS', 'CARE', 'EQUIP'];

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'PREPARE': 'bg-blue-100 text-blue-700',
      'ASSESS': 'bg-yellow-100 text-yellow-700',
      'CARE': 'bg-green-100 text-green-700',
      'EQUIP': 'bg-purple-100 text-purple-700'
    };
    return colors[stage] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Active Care': 'bg-green-500',
      'New 2025': 'bg-blue-500',
      'Potential': 'bg-yellow-500',
      'Ending Soon': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">SendKC Planter Tracker</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your church planters through their 5-year journey</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Planter
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Planters</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPlanters}</p>
                  <p className="text-xs text-gray-400 mt-1">All stages</p>
                </div>
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Care</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">{stats.activeCare}</p>
                  <p className="text-xs text-gray-400 mt-1">Funded & Active</p>
                </div>
                <Award className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New 2025</p>
                  <p className="text-2xl font-bold text-blue-600 mt-1">{stats.new2025}</p>
                  <p className="text-xs text-gray-400 mt-1">Starting soon</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Potential</p>
                  <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.potential}</p>
                  <p className="text-xs text-gray-400 mt-1">Assessment phase</p>
                </div>
                <Target className="w-8 h-8 text-yellow-400" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Staff Reps</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">{stats.uniqueReps}</p>
                  <p className="text-xs text-gray-400 mt-1">Field representatives</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, church, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterRep}
              onChange={(e) => setFilterRep(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>All Reps</option>
              {uniqueReps.map(rep => (
                <option key={rep} value={rep}>{rep}</option>
              ))}
            </select>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>All Stages</option>
              {stages.map(stage => (
                <option key={stage} value={stage}>{stage}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option>All Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setFilterStage('All Stages')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
              filterStage === 'All Stages'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            All ({planters.length})
          </button>
          {stages.map(stage => {
            const count = planters.filter(p => p.stage === stage).length;
            return (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  filterStage === stage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {stage} ({count})
              </button>
            );
          })}
        </div>

        {/* Planters Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Planter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Church
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Care Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Training
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlanters.map((planter) => (
                  <tr key={planter.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-indigo-700 font-medium text-sm">
                              {planter.firstName[0]}{planter.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {planter.firstName} {planter.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{planter.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {planter.fieldStaffRep}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{planter.church}</div>
                      <div className="text-sm text-gray-500">{planter.sendingChurch}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {planter.careStart && planter.endDate ? (
                        <div>
                          <div>{new Date(planter.careStart).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-400">
                            {new Date(planter.endDate).toLocaleDateString()}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not started</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(planter.stage)}`}>
                        {planter.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {planter.funding > 0 ? `$${planter.funding.toLocaleString()}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {planter.training ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {planter.training}
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Never
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedPlanter(planter)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPlanters.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No planters found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Planter Detail Modal */}
      {selectedPlanter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedPlanter.firstName} {selectedPlanter.lastName}
                </h2>
                <button
                  onClick={() => setSelectedPlanter(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Church</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPlanter.church}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Stage</label>
                  <p className="mt-1">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStageColor(selectedPlanter.stage)}`}>
                      {selectedPlanter.stage}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPlanter.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPlanter.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Field Staff Rep</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPlanter.fieldStaffRep}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Sending Church</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedPlanter.sendingChurch}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Spouse</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPlanter.spouseFirst} {selectedPlanter.spouseLast}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Monthly Funding</label>
                  <p className="mt-1 text-sm text-gray-900">
                    ${selectedPlanter.funding.toLocaleString()}
                  </p>
                </div>
                {selectedPlanter.careStart && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Care Start Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedPlanter.careStart).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Care End Date</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedPlanter.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
                {selectedPlanter.orientation && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Orientation</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedPlanter.orientation).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-500">Training Year</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedPlanter.training || 'Not completed'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Edit Planter
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  View Process
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
