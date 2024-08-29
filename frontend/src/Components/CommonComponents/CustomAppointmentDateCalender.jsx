import React, { useState } from 'react';
import CustomSpinner from './CustomSpinner';

const getDay = (day, date) => {
  let weekday = new Date(new Date(date).setDate(day)).toLocaleString('en-US', { weekday: 'long' });
  return String(weekday).toLowerCase();
};

const CalenderAndTimeSlot = ({ selectedDoctor, formData, setFormData, getAllAppointmentData }) => {
  const availableDays = [];
  const offDays = [];
  const [date, setDate] = useState(new Date());
  const unavailabeDays = [1, 7, 12];
  const { availability } = selectedDoctor?.[0] || {}; // Updated to use 'availability'

  const weekday = new Date(date).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();

  // Extract available and off days from the 'availability' object
  Object.entries(availability || {}).forEach(([dateKey, dateValue]) => {
    if (dateValue.a_status === 'Available') {
      //localhost:3000/dashboard
      http: availableDays.push(dateKey);
    } else {
      offDays.push(dateKey);
    }
  });

  const bookedAppointments =
    (Object.keys(getAllAppointmentData || {}).length > 0 &&
      getAllAppointmentData?.filter((e) => e?.bookDate?.slice(0, 10) === date.toISOString().slice(0, 10))
        .filter((e) => e?.status !== 'Cancelled')
        .map((e) => ({
          patient: e?.patient?.id,
          bookedTime: e?.bookTimeSlot?._id,
          bookedStatus: e?.status,
          name: e?.patient?.name,
        }))) ||
    [];

  let ibookedSlots = availability?.[date?.toISOString().slice(0, 10)]?.timeSlots || [];

  return (
    <>
      <label className="text-sm font-medium text-primary-900 mb-1">Date</label>
      <div className="calendarTimeSlotViewDiv gap-5 grid grid-cols-1 md:grid-cols-2">
        <CalenderView setDate={setDate} date={date} availableDays={availableDays} offDays={offDays} unavailabeDays={unavailabeDays} />
        {date !== null && !offDays.includes(weekday) && <TimeSlots selectedDate={date} setFormData={setFormData} formData={formData} timeSlots={ibookedSlots} bookedAppointments={bookedAppointments} />}
      </div>
    </>
  );
};

const CalenderView = ({ date, setDate, offDays, availableDays, unavailabeDays }) => {
  const [weekday, setWeekday] = useState();

  const daysInMonth = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const isToday = (day) => {
    return new Date(new Date(date).setDate(day)).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10);
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth();

    for (let day = 1; day <= totalDays; day++) {
      const dayKey = new Date(new Date(date).setDate(day)).toISOString().slice(0, 10); // Get the current date in ISO format
      const isDayAvailable = availableDays?.includes(String(dayKey));
      days.push(
        <button
          style={{ backgroundColor: isDayAvailable ? 'lightgreen' : 'tomato' }}
          key={day}
          onClick={() => handleDayClick(day)}
          className={`calendar-day text-center border border-black p-1 md:p-2 lg:p-3 rounded-lg hover:border-4 border-black
          ${isToday(day) ? 'border  border-blue-500 bg-blue-300' : 'bg-white'}
          focus:border-4 border-black
          `}
          data-tip="hello"
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  const changeMonth = (delta) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + delta);
    setDate(newDate);
  };

  const handleDayClick = (day) => {
    if (offDays.includes(getDay(day, date))) {
      return false;
    }
    setWeekday(getDay(day, date));
    // Create a new date object based on the clicked day
    const newDate = new Date(date);
    newDate.setDate(day);
    setDate(newDate);
  };

  return (
    <div className="calendar border-2 border-gray-300 p-2 w-full bg-gray-50 rounded-lg">
      <div className="calendar-header flex justify-between py-2">
        <button onClick={() => changeMonth(-1)}>&#x1F844;</button>
        <div className="font-bold">{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
        <button onClick={() => changeMonth(1)}>&#x1F846;</button>
      </div>

      <div className="calendar-grid grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
          <div key={index} className="text-center font-bold">
            {dayName}
          </div>
        ))}

        {/* Calculate the offset for the starting day of the month */}
        {Array.from({ length: new Date(date.getFullYear(), date.getMonth(), 1).getDay() }, (_, i) => (
          <div key={`offset-${i}`} className="text-center font-bold"></div>
        ))}

        {renderDays()}
      </div>
      {!availableDays.includes(date.toISOString().slice(0, 10)) && <h6 className="text-center text-red-400 font-bold">Doctor not available for this day</h6>}
    </div>
  );
};

const TimeSlots = ({ selectedDate, setFormData, formData, timeSlots, bookedAppointments }) => {
  const [bookedSlot, setBookedSlot] = useState();

  const handleUpdateForm = (slotBlock) => {
    setFormData((prevForm) => ({ ...prevForm, bookDate: selectedDate, bookTimeSlot: slotBlock }));
  };

  return (
    <div className="border-2 border-gray-300 p-2 w-full bg-gray-50 rounded-lg">
      <p className="font-bold mb-2 bg-slate-200 border rounded-lg text-center" style={{ position: 'sticky', top: 0 }}>
        Select Time {new Date(selectedDate).toLocaleDateString()}
      </p>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 h-[40vh] overflow-y-scroll">
        {timeSlots?.map((e, i) => {
          const isBooked = bookedAppointments?.filter((i) => i?.bookedTime == e?._id)?.[0];
          return (
            <button
              key={e?._id}
              className={`rounded-md p-1 md:p-2 drop-shadow-lg border-gray cursor-pointer
                ${!isBooked?.bookedStatus && 'focus:bg-blue-400'}
                ${isBooked?.bookedTime ? 'bg-red-500 text-white' : 'bg-green-400'}`}
              onClick={() => {
                if (!isBooked?.bookedStatus) {
                  handleUpdateForm(e);
                  setBookedSlot(e?._id);
                  setFormData((prev) => ({ ...prev, status: 'Booked' }));
                }
              }}
              id={e?._id}
            >
              <div className="slotContent flex flex-col text-center" data-te-toggle="tooltip" data-te-placement="top" data-te-ripple-init data-te-ripple-color="light" title={bookedAppointments?.filter((i) => i?.bookedTime === e?._id)?.[0]?.name ? `Booked By ${bookedAppointments?.filter((i) => i?.bookedTime === e?._id)?.[0]?.name}` : 'Empty'}>
                <p className="text-sm">
                  {e?.startTime} - {e?.endTime}
                </p>
                <p className="bookedStatusLabel text-sm ">{isBooked?.bookedTime ? (isBooked?.bookedStatus ? isBooked?.bookedStatus : 'Booked') : bookedSlot !== e?._id ? 'Available' : 'Booked'}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalenderAndTimeSlot;
