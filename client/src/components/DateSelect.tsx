import { Dispatch, ChangeEvent, SetStateAction } from "react";

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
  function handleChange(e: ChangeEvent) {
    e.preventDefault();
    const target = e.target as HTMLInputElement;
    const selectedDate = target.value;
    if (selectedDate) {
      setSelectHighlights(highlights[selectedChapter][selectedDate]);
    } else {
      setSelectHighlights([]);
    }
  }

  return (
    <select onChange={handleChange}>
      <option value="">Select Date</option>
      {selectedChapter &&
        Object.keys(highlights[selectedChapter]).map((date) => {
          return <option value={date}>{date}</option>;
        })}
    </select>
  );
}
