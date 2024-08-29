import React, { useEffect, useState } from 'react';
import CustomSpinner from './CustomSpinner';

const getDay = (day, date) => {
  let weekday = new Date(new Date(date).setDate(day)).toLocaleString('en-US', { weekday: 'long' });
  return String(weekday).toLowerCase();
};

const AvailabilityCalendarAndTimeSlots = ({ formData, setFormData }) => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold text-primary-900 mb-4 border-l-4 border-primary-400 pl-3">Availability</h2>
        <CalenderView selectedDate={date} setSelectedDate={setDate} availableDays={formData?.availability} setAvailableDays={setFormData} />
      </div>
      {Object.keys(formData?.availability || {})?.length > 0 && (
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold text-primary-900 mb-4 border-l-4 border-primary-400 pl-3">Set Time Slots</h2>
          <TimeSlotsConfig date={date} setDate={setDate} availableDays={formData?.availability} setAvailableDays={setFormData} />
        </div>
      )}
    </div>
  );
};

const CalenderView = ({ selectedDate, setSelectedDate, availableDays, setAvailableDays }) => {
  const [weekday, setWeekday] = useState();
  const [offDays, setOffDays] = useState([]); // Initialize with the appropriate off days

  const daysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const isToday = (day) => {
    return new Date(selectedDate).setDate(day) === new Date().setHours(0, 0, 0, 0);
  };

  const handleDayDoubleClick = (day) => {
    const selectedDayDate = new Date(selectedDate);
    selectedDayDate.setDate(day);
    setSelectedDate(selectedDayDate);

    const selectedDayDateString = selectedDayDate.toISOString().slice(0, 10);

    // Check if the selected day exists in availableDays
    if (availableDays[selectedDayDateString]) {
      // If the day exists, remove it by creating a new object without that day
      const updatedAvailability = { ...availableDays };
      delete updatedAvailability[selectedDayDateString];
      setAvailableDays((prev) => ({ ...prev, availability: updatedAvailability }));
    }
  };

  const handleDayClick = (day) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(day);
    setSelectedDate(newDate);

    const selectedDayDateString = newDate.toISOString().slice(0, 10);

    // Check if the selected day already exists in availableDays
    if (!availableDays?.[selectedDayDateString]) {
      // If the day doesn't exist, add it to the object with the default "Available" status
      const selectedDay = {
        a_status: 'Available',
        timeSlots: [],
      };

      setAvailableDays((prevAvailability) => ({
        ...prevAvailability,
        availability: {
          ...prevAvailability.availability,
          [selectedDayDateString]: selectedDay,
        },
      }));
    }
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth();

    const calculate = (day) => {
      const dateToCheck = new Date(selectedDate);
      dateToCheck.setDate(day);
      const dateStringToCheck = dateToCheck.toISOString().slice(0, 10);

      const isDaySelected = availableDays?.hasOwnProperty(dateStringToCheck);

      if (isDaySelected) {
        return 'lightgreen';
      } else if (isToday(day)) {
        return 'blue';
      } else {
        return 'white';
      }
    };

    for (let day = 1; day <= totalDays; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          onDoubleClick={() => handleDayDoubleClick(day)} // Add double-click handler
          className={`calendar-day border border-black p-3 rounded-lg hover:border-4 border-black bg-white'
              focus:border-4 border-black`}
          style={{ backgroundColor: calculate(day) }}
          data-tip="hello"
        >
          {day}
        </button>,
      );
    }

    return days;
  };

  const changeMonth = (delta) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  return (
    <div style={{ height: '45vh' }}>
      <p className="text-sm font-medium text-primary-900">Mark Available Days</p>
      <div className="calendar border-2 border-gray-300 p-2 w-full bg-gray-50 rounded-lg">
        <div className="calendar-header flex justify-between py-2">
          <button onClick={() => changeMonth(-1)}>&#x1F844;</button>
          <div className="font-bold">{selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</div>
          <button onClick={() => changeMonth(1)}>&#x1F846;</button>
        </div>
        <div className="calendar-grid grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
            <div key={index} className="text-center font-bold">
              {dayName}
            </div>
          ))}
          {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }, (_, i) => (
            <div key={`offset-${i}`} className="text-center font-bold"></div>
          ))}
          {renderDays()}
        </div>
        {offDays.includes(weekday) && <h6 className="text-center text-red-400 font-bold">Doctor not available for this day</h6>}
      </div>
    </div>
  );
};

const TimeSlotsConfig = ({ date, setDateterm, availableDays, setAvailableDays }) => {
  const handleRemoveTimeSlot = (timeSlotToRemove) => {
    // Create a copy of availableDays
    const updatedAvailableDays = { ...availableDays };

    // Get the selected date in ISO format
    const selectedDateISO = date.toISOString().slice(0, 10);

    // Find the index of the time slot to remove
    const indexToRemove = updatedAvailableDays[selectedDateISO].timeSlots.findIndex((timeSlot) => timeSlot.startTime === timeSlotToRemove.startTime && timeSlot.endTime === timeSlotToRemove.endTime);

    console.log(indexToRemove, 'is it???', updatedAvailableDays[selectedDateISO].timeSlots);

    if (indexToRemove !== -1) {
      // Remove the time slot
      updatedAvailableDays[selectedDateISO].timeSlots.splice(indexToRemove, 1);

      // Update availableDays
      setAvailableDays((prev) => ({ ...prev, updatedAvailableDays }));
    }
  };

  return (
    <div style={{ height: '45vh' }}>
      <p className="text-sm font-medium text-primary-900">Time Slots For {date.toISOString().slice(0, 10)}</p>
      <div className="border-2 border-gray-300 p-2 w-full bg-gray-50 rounded-lg" style={{ overflowY: 'scroll', height: '30vh' }}>
        <div className="p-2 flex flex-wrap gap-1">
          {availableDays?.[date.toISOString().slice(0, 10)]?.timeSlots?.map((e, i) => (
            <div
              className="rounded-md p-2 drop-shadow-lg border-gray"
              style={{
                backgroundColor: '#2783e630',
                width: 'fit-content',
                display: 'flex',
                justifyContent: 'space-between',
                whiteSpace: 'nowrap',
                height: 'fit-content',
              }}
              key={i}
            >
              <p>
                {e.startTime} - {e.endTime}
              </p>
              <button className="bg-red-200 px-2 rounded ms-2" onClick={() => handleRemoveTimeSlot(e)}>
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <AddTimeSlot availability={availableDays} setAvailability={setAvailableDays} selectedDate={date} />
    </div>
  );
};

const generateTimeSlots = (startTime, endTime, duration) => {
  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);
  const interval = duration; // Use provided duration

  const timeSlots = [];
  let currentMinutes = startHours * 60 + startMinutes;

  while (currentMinutes + duration <= endHours * 60 + endMinutes) {
    const endTime = currentMinutes + duration;
    timeSlots.push({
      startTime: formatTime(currentMinutes),
      endTime: formatTime(endTime),
    });

    currentMinutes += interval;
  }

  return timeSlots;
};

// Utility function to format time
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

const AddTimeSlot = ({ selectedDate, availability, setAvailability }) => {
  const [startTime, setStartTime] = useState('09:00');
  const [selectedDuration, setSelectedDuration] = useState(10); // Duration in minutes
  const [endTime, setEndTime] = useState('09:10');

  // Watch for changes in startTime and selectedDuration
  // useEffect(() => {
  //   const [startHours, startMinutes] = startTime.split(':').map(Number);
  //   const endMinutes = startHours * 60 + startMinutes + selectedDuration;
  //   const endHours = Math.floor(endMinutes / 60);
  //   const endMins = endMinutes % 60;
  //   const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
  //   setEndTime(formattedEndTime);
  // }, [startTime, selectedDuration]);

  const handleAddTimeSlot = () => {
    setAvailability((prevFormData) => {
      const newFormData = { ...prevFormData };
      const selectedDateISOString = new Date(selectedDate).toISOString().slice(0, 10);

      if (!newFormData.availability[selectedDateISOString]) {
        newFormData.availability[selectedDateISOString] = {
          a_status: 'Available',
          date: selectedDateISOString,
          timeSlots: [],
        };
      }

      let timeSlots = generateTimeSlots(startTime, endTime, selectedDuration);
      console.log(timeSlots, 'not generating');
      // console.log(timeSlots);

      newFormData.availability[selectedDateISOString].timeSlots.push(...timeSlots);

      return newFormData;
    });
  };

  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex gap-3">
        <label htmlFor="SelectedDuration">Select Duration (in minutes):</label>
        <input type="number" name="SelectedDuration" className="rounded p-1 w-24 text-center" value={selectedDuration} onChange={(e) => setSelectedDuration(parseInt(e.target.value))} />
      </div>

      <div className="grid grid-cols-2">
        <div className="flex gap-3">
          <label htmlFor="StartSlot">Start Time:</label>
          <input type="text" name="StartSlot" value={startTime} className="rounded p-1 w-24 text-center" onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="flex gap-3">
          <label htmlFor="EndSlot">End Time:</label>
          <input className="rounded p-1 w-24 text-center" onChange={(e) => setEndTime(e.target.value)} type="text" name="EndSlot" value={endTime} />
        </div>
      </div>

      <button className="bg-blue-300 rounded" onClick={handleAddTimeSlot}>
        Add
      </button>
    </div>
  );
};

export default AvailabilityCalendarAndTimeSlots;
