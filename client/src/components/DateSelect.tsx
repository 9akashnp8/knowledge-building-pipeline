import { Dispatch, SetStateAction, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';

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
  const [ dates, setDates ] = useState<string[]>([])

  function handleChange(e: SelectChangeEvent<typeof dates>) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const selectedDate = target.value;
    setDates(
      typeof selectedDate === 'string' ? selectedDate.split(',') : selectedDate
    )
    if (selectedDate) {
      const selectedHighlights = Object.fromEntries(
        Object.entries(highlights[selectedChapter]).filter(
          ([key, _])=>selectedDate.includes(key)
        )
      )
      setSelectHighlights(Object.values(selectedHighlights).flat());
    } else {
      setSelectHighlights([]);
    }
  }

  return (
    <Box>
      <InputLabel id="selectDate">Select Date</InputLabel>
      <Select
        multiple
        sx={{ width: 200 }}
        labelId="selectDate"
        id="selectDate"
        value={dates}
        label="Select Date"
        onChange={handleChange}
        renderValue={(selected) => selected.join(', ')}
      >
        {selectedChapter &&
          Object.keys(highlights[selectedChapter]).map((date) => {
            return <MenuItem value={date}>
              <Checkbox checked={dates.indexOf(date) > -1} />
              <ListItemText primary={date} />
            </MenuItem>;
          })}
      </Select>
    </Box>
  );
}
