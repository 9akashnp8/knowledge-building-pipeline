import click

from functions import extract_highlights
from constants import PROMPT


@click.command()
@click.argument(
    "file",
    type=click.Path(exists=True),
)
@click.argument(
    "output",
    type=click.File('w', encoding='utf-8'),
)
@click.option(
    "--from_date",
    help='Extract highlights FROM given date'
)
@click.option(
    "--to_date",
    help='Extract highlights UPTO given date'
)
def run(file, output, from_date, to_date):
    output_file_name = output.name
    highlights = extract_highlights(file, from_date, to_date)
    final_content = PROMPT.format(content=highlights)
    output.write(final_content)
    click.secho(f"Done, Saved to {output_file_name}", fg='green')


if __name__ == "__main__":
    run()