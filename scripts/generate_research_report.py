#!/usr/bin/env python3
"""Generate a guarded, branded Luna1 equity-research PDF from reviewed JSON."""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

REPO_ROOT = Path(__file__).resolve().parents[1]
BRAND_PATH = REPO_ROOT / "src" / "config" / "brand.json"


def load_json(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def draw_header_footer(canvas, document, brand: dict, report: dict) -> None:
    if document.page == 1:
        return
    width, height = LETTER
    logo_path = REPO_ROOT / "public" / brand["logoRasterPath"].lstrip("/")
    logo_width = 0.82 * inch
    logo_height = logo_width * 440 / 1280
    canvas.saveState()
    canvas.drawImage(
        str(logo_path),
        0.68 * inch,
        height - 0.61 * inch,
        width=logo_width,
        height=logo_height,
        preserveAspectRatio=True,
        mask="auto",
    )
    canvas.setFont("Helvetica-Bold", 7.5)
    canvas.setFillColor(colors.HexColor(brand["colors"]["ink"]))
    canvas.drawString(1.62 * inch, height - 0.42 * inch, brand["name"].upper())
    canvas.setFont("Helvetica", 7.5)
    canvas.setFillColor(colors.HexColor(brand["colors"]["muted"]))
    canvas.drawRightString(
        width - 0.68 * inch,
        height - 0.42 * inch,
        f"{report['ticker']} | {report['reportTitle']}",
    )
    canvas.setStrokeColor(colors.HexColor(brand["colors"]["border"]))
    canvas.setLineWidth(0.5)
    canvas.line(0.68 * inch, height - 0.67 * inch, width - 0.68 * inch, height - 0.67 * inch)
    canvas.line(0.68 * inch, 0.61 * inch, width - 0.68 * inch, 0.61 * inch)
    canvas.setFillColor(colors.HexColor(brand["colors"]["muted"]))
    canvas.setFont("Helvetica", 6.8)
    canvas.drawString(0.68 * inch, 0.39 * inch, brand["websiteLabel"])
    canvas.drawCentredString(width / 2, 0.39 * inch, brand["footer"])
    canvas.drawRightString(width - 0.68 * inch, 0.39 * inch, f"Page {document.page}")
    canvas.setFont("Helvetica", 5.7)
    canvas.drawCentredString(width / 2, 0.19 * inch, brand["disclosure"])
    canvas.restoreState()


def build_report(input_path: Path, output_path: Path, qa: bool) -> None:
    brand = load_json(BRAND_PATH)
    report = load_json(input_path)
    required = ["companyName", "ticker", "reportTitle", "reportType", "lastUpdated", "sections"]
    missing = [field for field in required if not report.get(field)]
    if missing:
        raise ValueError(f"Missing required report fields: {', '.join(missing)}")
    if not qa and report.get("reviewed") is not True:
        raise ValueError("Publication blocked: input must set reviewed=true after source review.")

    logo_path = REPO_ROOT / "public" / brand["logoRasterPath"].lstrip("/")
    output_path.parent.mkdir(parents=True, exist_ok=True)
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            "CoverLabel",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor(brand["colors"]["blue"]),
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            "CoverTitle",
            parent=styles["Title"],
            fontName="Times-Bold",
            fontSize=28,
            leading=32,
            alignment=TA_LEFT,
            textColor=colors.HexColor(brand["colors"]["ink"]),
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            "ReportHeading",
            parent=styles["Heading1"],
            fontName="Times-Bold",
            fontSize=20,
            leading=24,
            textColor=colors.HexColor(brand["colors"]["ink"]),
            spaceBefore=8,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            "Disclosure",
            parent=styles["Normal"],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor(brand["colors"]["muted"]),
            alignment=TA_CENTER,
        )
    )
    cover_frame = Frame(0.8 * inch, 0.75 * inch, 6.9 * inch, 9.5 * inch, id="cover")
    body_frame = Frame(0.78 * inch, 0.82 * inch, 6.94 * inch, 9.25 * inch, id="body")
    document = BaseDocTemplate(
        str(output_path),
        pagesize=LETTER,
        leftMargin=0.8 * inch,
        rightMargin=0.8 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.82 * inch,
        title=f"{report['companyName']} | {brand['name']}",
        author=brand["analyst"],
    )
    document.addPageTemplates(
        [
            PageTemplate(id="Cover", frames=[cover_frame]),
            PageTemplate(
                id="Body",
                frames=[body_frame],
                onPage=lambda canvas, doc: draw_header_footer(canvas, doc, brand, report),
            ),
        ]
    )
    logo_width = 2.65 * inch
    story = [
        Spacer(1, 0.3 * inch),
        Image(
            str(logo_path),
            width=logo_width,
            height=logo_width * 440 / 1280,
        ),
        Spacer(1, 0.75 * inch),
        Paragraph(report["ticker"].upper(), styles["CoverLabel"]),
        Paragraph(report["companyName"], styles["CoverTitle"]),
        Paragraph(report["reportTitle"], styles["Heading2"]),
        Spacer(1, 0.18 * inch),
        Paragraph(report["reportType"], styles["Normal"]),
        Spacer(1, 0.7 * inch),
        Paragraph(f"Prepared by {brand['analyst']}", styles["Normal"]),
        Paragraph(brand["analystTitle"], styles["Normal"]),
        Paragraph(brand["education"], styles["Normal"]),
        Spacer(1, 0.22 * inch),
        Paragraph(f"Last Updated: {report['lastUpdated']}", styles["Normal"]),
        Paragraph(brand["websiteLabel"], styles["Normal"]),
        Spacer(1, 0.8 * inch),
        Paragraph(brand["disclosure"], styles["Disclosure"]),
        NextPageTemplate("Body"),
        PageBreak(),
    ]
    if qa:
        story.extend(
            [
                Paragraph("DRAFT QA - NOT FOR PUBLICATION", styles["CoverLabel"]),
                Spacer(1, 0.1 * inch),
            ]
        )
    for section in report["sections"]:
        story.append(Paragraph(section["title"], styles["ReportHeading"]))
        for paragraph in section.get("paragraphs", []):
            story.append(Paragraph(paragraph, styles["BodyText"]))
            story.append(Spacer(1, 0.12 * inch))
        if section.get("pageBreak"):
            story.append(PageBreak())
    document.build(story)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--qa", action="store_true", help="Allow a watermarked temporary QA render.")
    args = parser.parse_args()
    build_report(args.input, args.output, args.qa)


if __name__ == "__main__":
    main()
