import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFlights, createFlight, updateFlightStatus } from '../Features/adminSlice';

const AdminFlightsPage = () => {
  const dispatch = useDispatch();
  const { flights, loading, error } = useSelector(state => state.admin);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFlight, setNewFlight] = useState({
    flight_number: '',
    departure: '',
    arrival: '',
    date: '',
    price: '',
    availability: true,
  });

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  const handleCreateFlight = (e) => {
    e.preventDefault();
    dispatch(createFlight(newFlight)).then(() => {
      dispatch(fetchFlights());
      setShowCreateForm(false);
      setNewFlight({
        flight_number: '',
        departure: '',
        arrival: '',
        date: '',
        price: '',
        availability: true,
      });
    });
  };

  const handleStatusUpdate = (flightId, status) => {
    dispatch(updateFlightStatus({ id: flightId, status })).then(() => {
      dispatch(fetchFlights());
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Flight Management</h1>

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6 hover:bg-blue-600"
      >
        {showCreateForm ? 'Cancel' : 'Create New Flight'}
      </button>

      {showCreateForm && (
        <form onSubmit={handleCreateFlight} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Flight Number"
              value={newFlight.flight_number}
              onChange={(e) => setNewFlight({...newFlight, flight_number: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Departure"
              value={newFlight.departure}
              onChange={(e) => setNewFlight({...newFlight, departure: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="text"
              placeholder="Arrival"
              value={newFlight.arrival}
              onChange={(e) => setNewFlight({...newFlight, arrival: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="datetime-local"
              value={newFlight.date}
              onChange={(e) => setNewFlight({...newFlight, date: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={newFlight.price}
              onChange={(e) => setNewFlight({...newFlight, price: e.target.value})}
              className="border border-gray-300 rounded px-3 py-2"
              required
            />
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={newFlight.availability}
                onChange={(e) => setNewFlight({...newFlight, availability: e.target.checked})}
                className="mr-2"
              />
              Available
            </label>
          </div>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600">
            Create Flight
          </button>
        </form>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Flight Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {flights.map((flight) => (
              <tr key={flight.id}>
                <td className="px-6 py-4 whitespace-nowrap">{flight.flight_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{flight.departure} → {flight.arrival}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(flight.date).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">${flight.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    flight.status === 'on-time' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {flight.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={flight.status}
                    onChange={(e) => handleStatusUpdate(flight.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="on-time">On-time</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminFlightsPage;
