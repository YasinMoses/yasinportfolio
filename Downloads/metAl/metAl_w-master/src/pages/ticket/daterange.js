import React, { useState } from "react";
// import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css fil
import "./daterange.css";

import { defaultStaticRanges, createStaticRanges } from "react-date-range";

import { addDays } from "date-fns";

const date = new Date();
const year = date.getFullYear();

const staticRanges = [
  ...defaultStaticRanges,
  ...createStaticRanges([
    {
      label: "Quater1",
      range: () => ({
        startDate: new Date(year, 0),
        endDate: new Date(year, 3),
      }),
    },
    {
      label: "Quater2",
      range: () => ({
        startDate: new Date(year, 3),
        endDate: new Date(year, 6),
      }),
    },
    {
      label: "Quater3",
      range: () => ({
        startDate: new Date(year, 6),
        endDate: new Date(year, 9),
      }),
    },
    {
      label: "Quater4",
      range: () => ({
        startDate: new Date(year, 9),
        endDate: new Date(year, 11),
      }),
    },
  ]),
];

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
      onChange={(item) => setselectionRanges({ ...item })}
      showSelectionPreview={true}
      moveRangeOnFirstSelection={false}
      minDate={addDays(new Date(), -300)}
      maxDate={addDays(new Date(), 900)}
      months={2}
      ranges={[selectionRanges.selection]}
      staticRanges={staticRanges}
      direction="horizontal"
    />
  );
}
