import React, { useState } from "react";
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

export default function RangePicker({ className, ...props }) {
  const [selectionRanges, setselectionRanges] = useState({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });
  const handleSelect = (date) => {
    console.log(date); // native Date object
  };
  return (
    <DateRangePicker
      className={`position-absolute daterange ${className}`}
      onChange={(item) => setselectionRanges({ ...item })}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      minDate={addDays(new Date(), -300)}
      maxDate={addDays(new Date(), 900)}
      months={2}
      ranges={[selectionRanges.selection]}
      direction="horizontal"
    />
  );
}
