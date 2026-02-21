import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { 
  FiCalendar, FiEdit, FiTrash2, FiPlus, FiSave, 
  FiX, FiUsers, FiClock, FiMapPin, FiLink, FiImage,
  FiTag, FiPercent, FiUser
} from 'react-icons/fi';
import useAuthStore from '@/store/useAuthStore.js';
import AdminPlanManagement from '../AdminPages/AdminPaymentManagement.jsx';
import toast from 'react-hot-toast';

const AdminPlanAndEventManagement = () => {
  const [events, setEvents] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    endDate: '',
    location: '',
    type: 'workshop',
    maxAttendees: '',
    registrationLink: '',
    imageUrl: ''
  });
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    DiscountPercent: '',
    ExpiryDate: '',
    ApplicableType: [],
    isActive: true,
    maxUsages: 100,
    maxUsagePerUser: 1
  });
  const [formErrors, setFormErrors] = useState({
    code: '',
    DiscountPercent: '',
    ApplicableType: ''
  });

  const [editingEvent, setEditingEvent] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { 
    user, 
    isLoading,
    fetchEvents, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    getEventAttendees,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon
  } = useAuthStore();

  useEffect(() => {
    loadEvents();
    loadCoupons();
  }, []);

  const loadEvents = async () => {
    try {
      const eventsData = await fetchEvents();
      setEvents(eventsData);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const loadCoupons = async () => {
    try {
      const res = await fetchCoupons();
      if(res.success) {
        setCoupons(res.coupons);
        toast.success(res.message || "Coupons fetched successfully");
      } else {
        toast.error(res.message || "Failed to fetch coupons");
      }
    } catch (err) {
      console.error('Failed to fetch coupons:', err);
    }
  };

  const validateCouponForm = () => {
    const errors = {};
    let isValid = true;

    if (!newCoupon.code.trim()) {
      errors.code = 'Coupon code is required';
      isValid = false;
    }

    if (!newCoupon.DiscountPercent || isNaN(newCoupon.DiscountPercent) || 
        Number(newCoupon.DiscountPercent) <= 0 || Number(newCoupon.DiscountPercent) > 100) {
      errors.DiscountPercent = 'Please enter a valid discount percentage (1-100)';
      isValid = false;
    }

    if (newCoupon.ApplicableType.length === 0) {
      errors.ApplicableType = 'Please select at least one applicable type';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const validateEditCouponForm = () => {
    const errors = {};
    let isValid = true;

    if (!editingCoupon.code.trim()) {
      errors.code = 'Coupon code is required';
      isValid = false;
    }

    if (!editingCoupon.DiscountPercent || isNaN(editingCoupon.DiscountPercent) || 
        Number(editingCoupon.DiscountPercent) <= 0 || Number(editingCoupon.DiscountPercent) > 100) {
      errors.DiscountPercent = 'Please enter a valid discount percentage (1-100)';
      isValid = false;
    }

    if (editingCoupon.ApplicableType.length === 0) {
      errors.ApplicableType = 'Please select at least one applicable type';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreateEvent = async () => {
    try {
      const eventToCreate = {
        ...newEvent,
        date: new Date(newEvent.date).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString()
      };

      const createdEvent = await createEvent(eventToCreate);
      if (createdEvent) {
        await loadEvents();
        setIsAdding(false);
        setNewEvent({
          title: '',
          description: '',
          date: '',
          endDate: '',
          location: '',
          type: 'workshop',
          maxAttendees: '',
          registrationLink: '',
          imageUrl: ''
        });
      }
    } catch (err) {
      console.error('Failed to create event:', err);
    }
  };

  const handleCreateCoupon = async () => {
    if (!validateCouponForm()) return;

    try {
      const couponToCreate = {
        ...newCoupon,
        ExpiryDate: newCoupon.ExpiryDate ? new Date(newCoupon.ExpiryDate).toISOString() : null,
        DiscountPercent: Number(newCoupon.DiscountPercent),
        maxUsages: Number(newCoupon.maxUsages) || 100,
        maxUsagePerUser: Number(newCoupon.maxUsagePerUser) || 1
      };

      const res = await createCoupon(couponToCreate);
      if (res.success) {
        toast.success(res.message || "Coupon created successfully");
        await loadCoupons();
        setIsAddingCoupon(false);
        setNewCoupon({
          code: '',
          DiscountPercent: '',
          ExpiryDate: '',
          ApplicableType: [],
          isActive: true,
          maxUsages: 100,
          maxUsagePerUser: 1
        });
        setFormErrors({
          code: '',
          DiscountPercent: '',
          ApplicableType: ''
        });
      } else {
        toast.error(res.message || "Failed to create coupon");
      }
    } catch (err) {
      console.error('Failed to create coupon:', err);
      toast.error("Failed to create coupon");
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const eventToUpdate = {
        ...editingEvent,
        date: new Date(editingEvent.date).toISOString(),
        endDate: new Date(editingEvent.endDate).toISOString()
      };

      const updatedEvent = await updateEvent(editingEvent._id, eventToUpdate);
      if (updatedEvent) {
        await loadEvents();
        setEditingEvent(null);
      }
    } catch (err) {
      console.error('Failed to update event:', err);
    }
  };

  const handleUpdateCoupon = async () => {
    if (!validateEditCouponForm()) return;

    try {
      const couponToUpdate = {
        ...editingCoupon,
        ExpiryDate: editingCoupon.ExpiryDate ? new Date(editingCoupon.ExpiryDate).toISOString() : null,
        DiscountPercent: Number(editingCoupon.DiscountPercent),
        maxUsages: Number(editingCoupon.maxUsages) || 100,
        maxUsagePerUser: Number(editingCoupon.maxUsagePerUser) || 1
      };

      const res = await updateCoupon(editingCoupon._id, couponToUpdate);
      if (res.success) {
        toast.success(res.message || "Coupon updated successfully");
        await loadCoupons();
        setEditingCoupon(null);
        setFormErrors({
          code: '',
          DiscountPercent: '',
          ApplicableType: ''
        });
      } else {
        toast.error(res.message || "Failed to update coupon");
      }
    } catch (err) {
      console.error('Failed to update coupon:', err);
      toast.error("Failed to update coupon");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const deletedEventId = await deleteEvent(eventId);
      if (deletedEventId) {
        await loadEvents();
      }
    } catch (err) {
      console.error('Failed to delete event:', err);
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const res = await deleteCoupon(couponId);
      if (res.success) {
        setDeleteConfirm(null);
        toast.success(res.message || "Coupon deleted successfully");
        await loadCoupons();
      } else {
        toast.error(res.message || "Failed to delete coupon");
      }
    } catch (err) {
      console.error('Failed to delete coupon:', err);
      toast.error("Failed to delete coupon");
    }
  };

  const handleViewAttendees = async (eventId) => {
    try {
      const attendees = await getEventAttendees(eventId);
      console.log('Attendees:', attendees);
      alert(`Viewing attendees for event ${eventId}`);
    } catch (err) {
      console.error('Failed to fetch attendees:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No expiry';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getEventStatus = (start, end) => {
    const now = new Date();
    if (now < new Date(start)) return 'Upcoming';
    if (now > new Date(end)) return 'Completed';
    return 'Ongoing';
  };

  const toggleApplicableType = (type) => {
    if (editingCoupon) {
      const updatedTypes = editingCoupon.ApplicableType.includes(type)
        ? editingCoupon.ApplicableType.filter(t => t !== type)
        : [...editingCoupon.ApplicableType, type];
      setEditingCoupon({...editingCoupon, ApplicableType: updatedTypes});
      setFormErrors({...formErrors, ApplicableType: ''});
    } else {
      const updatedTypes = newCoupon.ApplicableType.includes(type)
        ? newCoupon.ApplicableType.filter(t => t !== type)
        : [...newCoupon.ApplicableType, type];
      setNewCoupon({...newCoupon, ApplicableType: updatedTypes});
      setFormErrors({...formErrors, ApplicableType: ''});
    }
  };

  const getCouponStatus = (expiryDate, isActive) => {
    const now = new Date();
    if (!isActive) return 'Inactive';
    if (expiryDate && now > new Date(expiryDate)) return 'Expired';
    return 'Active';
  };


  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <Tabs selectedIndex={activeTab} onSelect={index => setActiveTab(index)}>
        <TabList className="flex border-b border-gray-200">
          <Tab className="px-4 py-2 font-medium cursor-pointer focus:outline-none" selectedClassName="border-b-2 border-blue-500 text-blue-600">
            Plans
          </Tab>
          <Tab className="px-4 py-2 font-medium cursor-pointer focus:outline-none" selectedClassName="border-b-2 border-blue-500 text-blue-600">
            Events
          </Tab>
          <Tab className="px-4 py-2 font-medium cursor-pointer focus:outline-none" selectedClassName="border-b-2 border-blue-500 text-blue-600">
            Coupons
          </Tab>
        </TabList>

        <TabPanel>
          <AdminPlanManagement />
        </TabPanel>

        <TabPanel>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">Event Management</h2>
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center w-full sm:w-auto justify-center"
            >
              <FiPlus className="mr-2" /> Add New Event
            </button>
          </div>

          {isAdding && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-lg mb-4">Add New Event</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Title*</label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Description*</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date & Time*</label>
                  <input
                    type="datetime-local"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date & Time*</label>
                  <input
                    type="datetime-local"
                    value={newEvent.endDate}
                    onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Location*</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type*</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="workshop">Workshop</option>
                    <option value="webinar">Webinar</option>
                    <option value="seminar">Seminar</option>
                    <option value="meetup">Meetup</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Attendees</label>
                  <input
                    type="number"
                    min="1"
                    value={newEvent.maxAttendees}
                    onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Link</label>
                  <input
                    type="url"
                    value={newEvent.registrationLink}
                    onChange={(e) => setNewEvent({...newEvent, registrationLink: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input
                    type="url"
                    value={newEvent.imageUrl}
                    onChange={(e) => setNewEvent({...newEvent, imageUrl: e.target.value})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateEvent}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FiSave className="mr-2" /> Create Event
                </button>
              </div>
            </div>
          )}

          {editingEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Edit Event</h3>
                  <button 
                    onClick={() => setEditingEvent(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Title*</label>
                    <input
                      type="text"
                      value={editingEvent.title}
                      onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Description*</label>
                    <textarea
                      value={editingEvent.description}
                      onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date & Time*</label>
                    <input
                      type="datetime-local"
                      value={editingEvent.date}
                      onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date & Time*</label>
                    <input
                      type="datetime-local"
                      value={editingEvent.endDate}
                      onChange={(e) => setEditingEvent({...editingEvent, endDate: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Location*</label>
                    <input
                      type="text"
                      value={editingEvent.location}
                      onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type*</label>
                    <select
                      value={editingEvent.type}
                      onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="workshop">Workshop</option>
                      <option value="webinar">Webinar</option>
                      <option value="seminar">Seminar</option>
                      <option value="meetup">Meetup</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Attendees</label>
                    <input
                      type="number"
                      min="1"
                      value={editingEvent.maxAttendees}
                      onChange={(e) => setEditingEvent({...editingEvent, maxAttendees: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Registration Link</label>
                    <input
                      type="url"
                      value={editingEvent.registrationLink}
                      onChange={(e) => setEditingEvent({...editingEvent, registrationLink: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image URL</label>
                    <input
                      type="url"
                      value={editingEvent.imageUrl}
                      onChange={(e) => setEditingEvent({...editingEvent, imageUrl: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateEvent}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <FiSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{event.description}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                        {event.type}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">{formatDate(event.date)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        getEventStatus(event.date, event.endDate) === 'Upcoming' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : getEventStatus(event.date, event.endDate) === 'Ongoing'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getEventStatus(event.date, event.endDate)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingEvent({
                            ...event,
                            date: new Date(event.date).toISOString().slice(0, 16),
                            endDate: new Date(event.endDate).toISOString().slice(0, 16)
                          })}
                          className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                          aria-label="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                        <button
                          onClick={() => handleViewAttendees(event._id)}
                          className="text-purple-600 hover:text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded p-1"
                          aria-label="View Attendees"
                        >
                          <FiUsers size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabPanel>

 <TabPanel>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold">Coupon Management</h2>
            <button
              onClick={() => setIsAddingCoupon(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center w-full sm:w-auto justify-center"
            >
              <FiPlus className="mr-2" /> Add New Coupon
            </button>
          </div>

          {isAddingCoupon && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium text-lg mb-4">Add New Coupon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Coupon Code*</label>
                  <input
                    type="text"
                    value={newCoupon.code}
                    onChange={(e) => {
                      setNewCoupon({...newCoupon, code: e.target.value});
                      setFormErrors({...formErrors, code: ''});
                    }}
                    className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      formErrors.code ? 'border-red-500' : ''
                    }`}
                    required
                  />
                  {formErrors.code && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Percentage*</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={newCoupon.DiscountPercent}
                      onChange={(e) => {
                        setNewCoupon({...newCoupon, DiscountPercent: e.target.value});
                        setFormErrors({...formErrors, DiscountPercent: ''});
                      }}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8 ${
                        formErrors.DiscountPercent ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    <FiPercent className="absolute left-2 top-3 text-gray-400" />
                  </div>
                  {formErrors.DiscountPercent && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.DiscountPercent}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={newCoupon.ExpiryDate}
                      onChange={(e) => setNewCoupon({...newCoupon, ExpiryDate: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                    />
                    <FiCalendar className="absolute left-2 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={newCoupon.isActive ? 'true' : 'false'}
                    onChange={(e) => setNewCoupon({...newCoupon, isActive: e.target.value === 'true'})}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Usages (Default: 100)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.maxUsages}
                      onChange={(e) => setNewCoupon({...newCoupon, maxUsages: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                    />
                    <FiUsers className="absolute left-2 top-3 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Usage Per User (Default: 1)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={newCoupon.maxUsagePerUser}
                      onChange={(e) => setNewCoupon({...newCoupon, maxUsagePerUser: e.target.value})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                    />
                    <FiUser className="absolute left-2 top-3 text-gray-400" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Applicable For*</label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleApplicableType('counselling')}
                      className={`px-3 py-1 text-sm rounded-full flex items-center ${
                        newCoupon.ApplicableType.includes('counselling')
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      <FiTag className="mr-1" /> Counselling
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleApplicableType('tool')}
                      className={`px-3 py-1 text-sm rounded-full flex items-center ${
                        newCoupon.ApplicableType.includes('tool')
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-gray-100 text-gray-800 border border-gray-300'
                      }`}
                    >
                      <FiTag className="mr-1" /> Tool
                    </button>
                  </div>
                  {formErrors.ApplicableType && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.ApplicableType}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={() => {
                    setIsAddingCoupon(false);
                    setFormErrors({
                      code: '',
                      DiscountPercent: '',
                      ApplicableType: ''
                    });
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCoupon}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <FiSave className="mr-2" /> Create Coupon
                </button>
              </div>
            </div>
          )}

          {editingCoupon && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-lg">Edit Coupon</h3>
                  <button 
                    onClick={() => {
                      setEditingCoupon(null);
                      setFormErrors({
                        code: '',
                        DiscountPercent: '',
                        ApplicableType: ''
                      });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Coupon Code*</label>
                    <input
                      type="text"
                      value={editingCoupon.code}
                      onChange={(e) => {
                        setEditingCoupon({...editingCoupon, code: e.target.value});
                        setFormErrors({...formErrors, code: ''});
                      }}
                      className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        formErrors.code ? 'border-red-500' : ''
                      }`}
                      required
                    />
                    {formErrors.code && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.code}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Discount Percentage*</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={editingCoupon.DiscountPercent}
                        onChange={(e) => {
                          setEditingCoupon({...editingCoupon, DiscountPercent: e.target.value});
                          setFormErrors({...formErrors, DiscountPercent: ''});
                        }}
                        className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8 ${
                          formErrors.DiscountPercent ? 'border-red-500' : ''
                        }`}
                        required
                      />
                      <FiPercent className="absolute left-2 top-3 text-gray-400" />
                    </div>
                    {formErrors.DiscountPercent && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.DiscountPercent}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date (Optional)</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        value={editingCoupon.ExpiryDate ? new Date(editingCoupon.ExpiryDate).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setEditingCoupon({...editingCoupon, ExpiryDate: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                      />
                      <FiCalendar className="absolute left-2 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={editingCoupon.isActive ? 'true' : 'false'}
                      onChange={(e) => setEditingCoupon({...editingCoupon, isActive: e.target.value === 'true'})}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Usages (Default: 100)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={editingCoupon.maxUsages}
                        onChange={(e) => setEditingCoupon({...editingCoupon, maxUsages: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                      />
                      <FiUsers className="absolute left-2 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Usage Per User (Default: 1)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={editingCoupon.maxUsagePerUser}
                        onChange={(e) => setEditingCoupon({...editingCoupon, maxUsagePerUser: e.target.value})}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-8"
                      />
                      <FiUser className="absolute left-2 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Applicable For*</label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleApplicableType('counselling')}
                        className={`px-3 py-1 text-sm rounded-full flex items-center ${
                          editingCoupon.ApplicableType.includes('counselling')
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        <FiTag className="mr-1" /> Counselling
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleApplicableType('tool')}
                        className={`px-3 py-1 text-sm rounded-full flex items-center ${
                          editingCoupon.ApplicableType.includes('tool')
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-300'
                        }`}
                      >
                        <FiTag className="mr-1" /> Tool
                      </button>
                    </div>
                    {formErrors.ApplicableType && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.ApplicableType}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => {
                      setEditingCoupon(null);
                      setFormErrors({
                        code: '',
                        DiscountPercent: '',
                        ApplicableType: ''
                      });
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateCoupon}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <FiSave className="mr-2" /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Usages</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Per User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Applicable For</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coupons?.map((coupon) => (
                  <tr key={coupon._id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-medium">{coupon.code}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">{coupon.DiscountPercent}%</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">{formatDate(coupon.ExpiryDate)}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">{coupon.maxUsages || 100}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">{coupon.maxUsagePerUser || 1}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {coupon.ApplicableType.includes('counselling') && (
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 flex items-center">
                            <FiTag className="mr-1" /> Counselling
                          </span>
                        )}
                        {coupon.ApplicableType.includes('tool') && (
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center">
                            <FiTag className="mr-1" /> Tool
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        getCouponStatus(coupon.ExpiryDate, coupon.isActive) === 'Active'
                          ? 'bg-green-100 text-green-800'
                          : getCouponStatus(coupon.ExpiryDate, coupon.isActive) === 'Expired'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}>
                        {getCouponStatus(coupon.ExpiryDate, coupon.isActive)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingCoupon({
                            ...coupon,
                            ExpiryDate: coupon.ExpiryDate ? new Date(coupon.ExpiryDate).toISOString().slice(0, 16) : ''
                          })}
                          className="text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
                          aria-label="Edit"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(coupon._id)}
                          className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 rounded p-1"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {deleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="font-medium text-lg mb-4">Confirm Deletion</h3>
                <p className="mb-6 text-gray-700">
                  Are you sure you want to delete this coupon? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteCoupon(deleteConfirm)}
                    disabled={isLoading}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Deleting...' : 'Delete Coupon'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdminPlanAndEventManagement;