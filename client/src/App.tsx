import { useState, useEffect, MouseEvent, SyntheticEvent } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack"
import Paper from "@mui/material/Paper"

import ChapterSelect from "./components/ChapterSelect";
import DateSelect from "./components/DateSelect";
import type { HighlighAPIResponse } from "./types";

function App() {
  const [highlights, setHighlights] = useState<HighlighAPIResponse | {}>({});
  const [selectedChaper, setSelectedChaper] = useState<string>("");
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [selectHighlights, setSelectHighlights] = useState<[]>([]);

  useEffect(() => {
    async function getHighlights() {
      fetch("http://localhost:8000/highlights?file_path=x")
        .then((res) => res.json())
        .then((json) => setHighlights(json))
        .catch((err) => console.log(err));
    }
    getHighlights();
  }, []);

  async function handleSelectHighlight(e: SyntheticEvent) {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const selectedHighlights = formData.getAll("selectedHighlight");

    const response = await fetch("http://localhost:8000/generate-prompt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "text/plain",
      },
      body: JSON.stringify({ selected_highlights: selectedHighlights }),
    });
    if (response.ok) {
      const prompt = await response.text();
      setGeneratedPrompt(prompt);
    }
  }

  function copyPrompt(e: MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      alert("Copied");
    });
  }

  return (
    <Paper variant="elevation" sx={{ margin: "40px", padding: "20px", height: "90vh", overflow: "auto"}}>
      <Stack direction={"row"} gap={2}>
        <ChapterSelect
          chapters={Object.keys(highlights)}
          setSelectedChaper={setSelectedChaper}
          setSelectHighlights={setSelectHighlights}
        />
        <DateSelect
          selectedChapter={selectedChaper}
          highlights={highlights}
          setSelectHighlights={setSelectHighlights}
        />
      </Stack>
      <form method="POST" onSubmit={handleSelectHighlight}>
        <FormGroup>
          {Object.values(selectHighlights).map((highlight, index) => {
            return (
              highlight.text
              ? (
                <FormControlLabel
                  control={
                    <Checkbox name="selectedHighlight" value={highlight} />
                  }
                  label={highlight}
                />
              ) : null
            );
          })}
        </FormGroup>
        <Button type="submit" variant="contained">
          Generate Prompt
        </Button>
      </form>
      <div>
        <p>{generatedPrompt}</p>
        <Button type="button" onClick={copyPrompt} variant="outlined">
          Copy
        </Button>
      </div>
    </Paper>
  );
}

export default App;
