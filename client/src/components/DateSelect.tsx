import { Dispatch, SetStateAction, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { HighlighAPIResponse } from "../types";

type Props = {
  selectedChapter: string;
  highlights: HighlighAPIResponse;
  setSelectHighlights: Dispatch<SetStateAction<any>>;
};

export default function DateSelect({
  selectedChapter,
  highlights,
  setSelectHighlights,
}: Props) {
  const [ date, setDate ] = useState<string>("")

  function handleChange(e: SelectChangeEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const selectedDate = target.value;
    setDate(selectedDate)
    if (selectedDate) {
      setSelectHighlights(highlights[selectedChapter][selectedDate]);
    } else {
      setSelectHighlights([]);
    }
  }

  return (
    <Box>
      <InputLabel id="selectDate">Select Date</InputLabel>
      <Select
        sx={{ width: 200 }}
        labelId="selectDate"
        id="selectDate"
        value={date}
        label="Select Date"
        onChange={handleChange}
      >
        {selectedChapter &&
          Object.keys(highlights[selectedChapter]).map((date) => {
            return <MenuItem value={date}>{date}</MenuItem>;
          })}
      </Select>
    </Box>
  );
}
