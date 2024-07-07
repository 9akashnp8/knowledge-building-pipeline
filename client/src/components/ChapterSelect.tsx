import { Dispatch, SetStateAction, useState } from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

type SelectChapterProps = {
  chapters: string[];
  setSelectedChaper: Dispatch<SetStateAction<string>>;
  setSelectHighlights: Dispatch<SetStateAction<any>>;
};

export default function ChapterSelect({
  chapters,
  setSelectedChaper,
  setSelectHighlights,
}: SelectChapterProps) {
  const [chapter, setChaper] = useState<string>("");

  function handleChange(e: SelectChangeEvent) {
    e.preventDefault();
    setSelectHighlights([]);
    const target = e.target as HTMLInputElement;
    const selectedChapter = target.value;
    setChaper(selectedChapter);
    setSelectedChaper(selectedChapter);
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <InputLabel id="selectChapter">Select Chapter</InputLabel>
      <Select
        sx={{ width: 400 }}
        labelId="selectChapter"
        id="selectChapter"
        value={chapter}
        label="Age"
        onChange={handleChange}
      >
        {chapters.map((chapter) => {
          return <MenuItem value={chapter}>{chapter}</MenuItem>;
        })}
      </Select>
    </Box>
  );
}
