
type Chapter = string

type Highlights = Record<string, string[]>

export type HighlighAPIResponse = Record<Chapter, Highlights>

export type FilteredHighlights = {
  text: string;
  checked: boolean;
}[]
