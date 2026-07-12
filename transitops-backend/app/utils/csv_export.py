"""
CSV export helper — used by reports router.
"""
import csv
import io


def rows_to_csv(rows: list[dict]) -> io.StringIO:
    """Convert a list of dicts into an in-memory CSV file."""
    output = io.StringIO()
    if not rows:
        return output
    writer = csv.DictWriter(output, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)
    output.seek(0)
    return output
