from datetime import datetime

import fitz  # PyMuPDF


def format_annot_created_date(create_date: str):
    result = ""
    date_format = "%Y%m%d%H%M%S"
    date = create_date[2:14]
    try:
        result = datetime.strptime(date, date_format)
    except ValueError:
        pass
    return result


def extract_highlights(pdf_path: str, from_date: datetime, to_date: datetime):

    doc = fitz.open(pdf_path)
    
    highlights = ""

    # Iterate through each page
    for page_num in range(len(doc)):

        page = doc.load_page(page_num)
        annots = page.annots()

        for annot in annots:
            rect = annot.rect
            info = annot.info
            # print(info)
            annot_create_date = info["creationDate"]
            date = format_annot_created_date(annot_create_date)
            if from_date and to_date:
                if date <= to_date and date >= from_date:
                    text = page.get_text("text", clip=rect)
                    highlights += f"{text.strip()}\n\n"
            elif from_date and not to_date:
                if date >= from_date:
                    text = page.get_text("text", clip=rect)
                    highlights += f"{text.strip()}\n\n"
            elif to_date and not from_date:
                if date <= to_date:
                    text = page.get_text("text", clip=rect)
                    highlights += f"{text.strip()}\n\n"
            else:
                pass

    return highlights

def main():
    pdf_path = "D:\Books\Tech\Luciano Ramalho - Fluent Python_ Clear, Concise, and Effective Programming-O'Reilly Media (2022).pdf"  # Change this to the path of your PDF file
    from_date = datetime(2024, 5, 28)
    highlights = extract_highlights(pdf_path, None, from_date)
    print(highlights)

if __name__ == "__main__":
    main()
