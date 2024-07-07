import { ChangeEvent, Dispatch, SetStateAction } from "react";


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
  function handleChange(e: ChangeEvent) {
    e.preventDefault();
    setSelectHighlights([]);
    const target = e.target as HTMLInputElement;
    const selectedChapter = target.value;
    setSelectedChaper(selectedChapter);
  }

  return (
    <select onChange={handleChange}>
      <option value="">Select Chapter</option>
      {chapters.map((chapter) => {
        return <option value={chapter}>{chapter}</option>;
      })}
    </select>
  );
}
