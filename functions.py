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

    # Iterate through each page
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        annots = page.annots()

        for annot in annots:
            rect = annot.rect
            annot_created_date = annot.info["creationDate"]
            date = format_annot_created_date(annot_created_date)
            if should_include_text(date, from_date, to_date):
                text = page.get_text("text", clip=rect)
                str_date = date.strftime("%d-%m-%Y")
                if str_date not in highlights:
                    highlights.update({str(str_date): [text]})
                else:
                    highlights[str(str_date)].append(text)
    
    return highlights