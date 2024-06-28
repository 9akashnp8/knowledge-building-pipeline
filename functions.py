import re
from datetime import datetime

import fitz

def format_annot_created_date(create_date: str):
    """
    Converts Annot.info.creationDate into valid
    datetime object

    Can be used to extract Annots from a specific
    time range.
    """
    result = ""
    date_format = "%Y%m%d%H%M%S"
    date = create_date[2:14]
    try:
        result = datetime.strptime(date, date_format)
    except ValueError:
        pass
    return result


def should_include_text(
    annot_date: datetime,
    from_date: datetime,
    to_date: datetime,
):
    """
    Wrapper for date filter logic
    """
    if from_date and to_date:
        return from_date <= annot_date <= to_date
    elif from_date:
        return annot_date >= from_date
    elif to_date:
        return annot_date <= to_date
    else:
        return True


def create_chapter_data(doc: fitz.Document):
    """
    Get details of chapters and their page
    ranges
    """
    result = []
    toc = doc.get_toc()
    chapter_tocs = [
        (chapter, start_page - 30) # 30 pages of pre book stuff not considered
        for level, chapter, start_page in toc
        if level == 2 and "chapter" in chapter.lower()
    ]
    for index, item in enumerate(chapter_tocs):
        chapter, start_page = item
        _, end_page = chapter_tocs[min(len(chapter_tocs) - 1, index + 1)]
        result.append((chapter, start_page, end_page))
    return result


def extract_highlights(
    pdf_path: str,
    notes_from_date: str = None,
    notes_upto_date: str = None
):
    """
    Main function that extract higlights from every page
    for given from_date upto to_date if provided
    """
    highlights = {}
    doc = fitz.open(pdf_path)

    # Convert dates into datetime for comparison
    from_date, to_date = None, None
    if notes_from_date:
        from_date = datetime.strptime(from_date, '%Y-%m-%d')
    if notes_upto_date:
        to_date = datetime.strptime(to_date, '%Y-%m-%d')
    
    chapter_page_range = create_chapter_data(doc)

    # Iterate through each page
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)

        # Extract Chapter
        chapter = [
            chapter for chapter, start, end in chapter_page_range
            if start <= page_num <= end
        ]
        if not chapter:
            chapter = "Unknown"
        else:
            chapter = chapter[0]
        if chapter not in highlights:
            highlights.update({chapter: {}})

        annots = page.annots()

        for annot in annots:
            rect = annot.rect
            annot_created_date = annot.info["creationDate"]
            date = format_annot_created_date(annot_created_date)
            if should_include_text(date, from_date, to_date):
                text = page.get_text("text", clip=rect)
                str_date = date.strftime("%d-%m-%Y")
                if str(str_date) not in highlights[chapter]:
                    highlights[chapter].update({str(str_date): [text]})
                else:
                    highlights[chapter][str(str_date)].append(text)
    
    return highlights
