import { useState } from "react";
import PropTypes from "prop-types";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

function DayPickerWithInput({ name, value, onChange }) {
  const [isPickerVisible, setPickerVisible] = useState(false);

  // Extract date and time values
  const [date, time] = value.split("T");

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    const fullValue = time ? `${newValue}T${time}` : newValue;
    onChange({ target: { name: e.target.name, value: fullValue } });
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const fullValue = date ? `${date}T${newTime}` : `T${newTime}`;
    onChange({ target: { name, value: fullValue } });
  };

  const handleDayClick = (selectedDate) => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const fullValue = time ? `${formattedDate}T${time}` : formattedDate;
    onChange({ target: { name, value: fullValue } });
    setPickerVisible(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "10px" }}>
      {/* Date Input */}
      <input
        type="date"
        name={name}
        value={date || ""}
        onChange={handleInputChange}
        onFocus={() => setPickerVisible(true)}
        style={{
          padding: "8px",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      />

      {/* Time Input */}
      <input
        type="time"
        value={time || ""}
        onChange={handleTimeChange}
        style={{
          padding: "8px",
          fontSize: "14px",
          marginLeft: "10px",
        }}
      />

      {isPickerVisible && (
        <div
          style={{
            display: "inline-block",
            position: "absolute",
            marginTop: "10px",
            zIndex: 10,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <DayPicker
            mode="single"
            selected={date ? new Date(date) : undefined}
            onSelect={handleDayClick}
          />
        </div>
      )}
    </div>
  );
}

DayPickerWithInput.propTypes = {
  name: PropTypes.string.isRequired, // Field name for dynamic form handling
  value: PropTypes.string.isRequired, // Current value of the field (date and time in ISO format)
  onChange: PropTypes.func.isRequired, // Function to handle changes in the parent
};

export default DayPickerWithInput;
