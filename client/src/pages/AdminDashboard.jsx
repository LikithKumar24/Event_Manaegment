import { useEffect, useState, useContext } from 'react';
import { UserContext } from '../UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash, FaChartBar, FaUsers, FaCalendarAlt } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';

export default function AdminDashboard() {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'users', or 'events'

  useEffect(() => {
    if (user?.isAdmin) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [usersRes, eventsRes, analyticsRes] = await Promise.all([
        axios.get('/admin/users'),
        axios.get('/admin/events'),
        axios.get('/admin/analytics')
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.error || 'Failed to delete user');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/admin/events/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  // Redirect if not admin
  if (!user || !user.isAdmin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Tab buttons */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            activeTab === 'dashboard'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <FaChartBar /> Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <FaUsers /> Users
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded flex items-center gap-2 ${
            activeTab === 'events'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          <FaCalendarAlt /> Events
        </button>
      </div>

      {/* Dashboard Analytics */}
      {activeTab === 'dashboard' && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">User Statistics</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Total Users:</span>
              <span className="font-bold">{analytics.totalUsers}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Event Statistics</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Total Events:</span>
              <span className="font-bold">{analytics.totalEvents}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Upcoming Events:</span>
              <span className="font-bold">{analytics.upcomingEvents}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Past Events:</span>
              <span className="font-bold">{analytics.pastEvents}</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Ticket Statistics</h3>
            <div className="flex items-center justify-between mb-2">
              <span>Total Tickets:</span>
              <span className="font-bold">{analytics.totalTickets}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span>Total Revenue:</span>
              <span className="font-bold">Rs. {analytics.totalRevenue}</span>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">Registered Users</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Admin Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td className="py-2 px-4 border-b">{user.name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">
                    {user.isAdmin ? 'Admin' : 'User'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {!user.isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Events Table */}
      {activeTab === 'events' && (
        <div className="overflow-x-auto">
          <h2 className="text-2xl font-bold mb-4">All Events</h2>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Organized By</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Ticket Price</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(event => (
                <tr key={event._id}>
                  <td className="py-2 px-4 border-b">{event.title}</td>
                  <td className="py-2 px-4 border-b">{event.organizedBy}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">{event.location}</td>
                  <td className="py-2 px-4 border-b">
                    {event.ticketPrice === 0 ? 'Free' : `Rs. ${event.ticketPrice}`}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 