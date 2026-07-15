from pathlib import Path
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak

OUT = Path("public/downloads")
OUT.mkdir(parents=True, exist_ok=True)
SITE = "luna1research.com"
ink, muted, line, accent = map(HexColor, ["#171817", "#62645f", "#d5d3cc", "#466f89"])
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Name", fontName="Helvetica", fontSize=28, leading=31, textColor=ink, spaceAfter=3))
styles.add(ParagraphStyle(name="Deck", fontName="Helvetica", fontSize=10, leading=14, textColor=muted))
styles.add(ParagraphStyle(name="Section", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=accent, spaceBefore=13, spaceAfter=7, tracking=1.4))
styles.add(ParagraphStyle(name="Role", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=ink))
styles.add(ParagraphStyle(name="BodySmall", fontName="Helvetica", fontSize=8.2, leading=11.2, textColor=muted))
styles.add(ParagraphStyle(name="Date", fontName="Helvetica", fontSize=8, leading=11, textColor=muted, alignment=TA_RIGHT))
styles.add(ParagraphStyle(name="ProfileHead", fontName="Helvetica", fontSize=18, leading=22, textColor=ink, spaceAfter=7))

roles = [
    ("Coronado Historical Association", "Executive & Finance Assistant", "May 2026 - Present", "Support accrual-basis accounting, accounts payable, bank and credit-card reconciliations, cash-flow planning, board reporting, and audit-ready nonprofit finance records."),
    ("LightEdge Solutions", "Data Center Operations Technician / NOC Technician", "Nov 2020 - Present", "Diagnose network, server, storage, and security issues; support VMware environments, infrastructure provisioning, connectivity testing, and change-management procedures."),
    ("United States Army", "Supply Specialist & Financial Management Technician", "Nov 2015 - May 2019", "Coordinated aviation and ground logistics; supported budgets, reconciliations, reporting, and accountability for more than $10 million in operational expenditures."),
    ("Wilgus Associates", "Junior Reconciliation Accountant", "Jun 2014 - Jul 2015", "Maintained ledgers, performed bank reconciliations, researched variances, supported month-end close, and helped reduce reconciliation time by 50% through automation."),
]

def header():
    table = Table([[Paragraph("SHY LEE", styles["Name"]), Paragraph(f"FINANCE / EQUITY RESEARCH<br/>Professional inquiries: {SITE}/contact", styles["Date"])]], colWidths=[4.3*inch, 2.9*inch])
    table.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP"), ("LINEBELOW", (0,0), (-1,-1), 1, line), ("BOTTOMPADDING", (0,0), (-1,-1), 11)]))
    return table

def make_resume():
    doc = SimpleDocTemplate(str(OUT / "shy-lee-resume.pdf"), pagesize=letter, rightMargin=.65*inch, leftMargin=.65*inch, topMargin=.5*inch, bottomMargin=.5*inch)
    story = [header(), Paragraph("PROFESSIONAL SUMMARY", styles["Section"]), Paragraph("Finance professional and U.S. Army veteran with experience in fundamental investment research, financial analysis, nonprofit finance, and mission-critical operations. Applies analytical rigor and an operational perspective to company fundamentals, valuation, industry structure, capital allocation, and risk.", styles["BodySmall"]), Paragraph("PROFESSIONAL EXPERIENCE", styles["Section"])]
    for company, role, date, desc in roles:
        row = Table([[Paragraph(f"{company}<br/><font color='#62645f'>{role}</font>", styles["Role"]), Paragraph(date, styles["Date"])]], colWidths=[5.5*inch, 1.7*inch])
        row.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP"), ("TOPPADDING", (0,0), (-1,-1), 3), ("BOTTOMPADDING", (0,0), (-1,-1), 3)]))
        story.append(KeepTogether([row, Paragraph(desc, styles["BodySmall"]), Spacer(1,5)]))
    story += [Paragraph("EDUCATION", styles["Section"]), Paragraph("<b>San Diego State University, Fowler College of Business</b> - B.S. Finance, expected 2027<br/><b>San Diego Miramar College</b> - A.S. Business Administration, 2024", styles["BodySmall"]), Paragraph("RESEARCH & LEADERSHIP", styles["Section"]), Paragraph("<b>Aztec Investment Fund (AIF)</b> - Fundamental equity research, thesis development, and AI infrastructure value-chain analysis informed by hands-on data center experience.", styles["BodySmall"]), Paragraph("CERTIFICATIONS & SKILLS", styles["Section"]), Paragraph("QuickBooks Online Level 1; Bloomberg Market Concepts; Microsoft Excel (completed).<br/>Financial statement analysis, budgeting and forecasting, account reconciliation, financial modeling, valuation, reporting, portfolio analysis, and Python workflows.", styles["BodySmall"])]
    doc.build(story)

def make_profile():
    doc = SimpleDocTemplate(str(OUT / "shy-lee-one-page-profile.pdf"), pagesize=letter, rightMargin=.7*inch, leftMargin=.7*inch, topMargin=.6*inch, bottomMargin=.55*inch)
    left = [Paragraph("CANDIDATE PROFILE", styles["Section"]), Paragraph("Finance discipline.<br/>Operational perspective.", styles["ProfileHead"]), Paragraph("U.S. Army veteran and finance professional connecting financial statements to the business beneath them.", styles["Deck"]), Paragraph("EXPERIENCE", styles["Section"]), Paragraph("<b>Finance assistant</b><br/>Accrual accounting, reconciliations, reporting, board materials, and audit trails.<br/><br/><b>Data center operations</b><br/>5+ years supporting mission-critical infrastructure, controls, records, and customer service.<br/><br/><b>U.S. Army</b><br/>Logistics and financial management supporting $10M+ in operational expenditures.", styles["BodySmall"])]
    right = [Paragraph("RESEARCH APPROACH", styles["Section"]), Paragraph("Fundamentals / valuation / industry structure / institutional behavior / technical structure / explicit risk rules", styles["BodySmall"]), Paragraph("EDUCATION", styles["Section"]), Paragraph("<b>B.S. Finance</b> - San Diego State University, expected 2027<br/><b>A.S. Business Administration</b> - San Diego Miramar College, 2024", styles["BodySmall"]), Paragraph("TOOLS & DEVELOPMENT", styles["Section"]), Paragraph("Financial modeling, Excel, QuickBooks Online, Bloomberg Market Concepts, tested portfolio metrics, Python document automation", styles["BodySmall"]), Paragraph("INVESTMENT PHILOSOPHY", styles["Section"]), Paragraph("A thesis is a hypothesis to update as evidence changes.", styles["ProfileHead"])]
    body = Table([[left, right]], colWidths=[3.25*inch, 3.25*inch], hAlign="LEFT")
    body.setStyle(TableStyle([("VALIGN", (0,0), (-1,-1), "TOP"), ("RIGHTPADDING", (0,0), (0,0), 22), ("LEFTPADDING", (1,0), (1,0), 22), ("LINEBEFORE", (1,0), (1,0), 1, line)]))
    story = [header(), Spacer(1, 10), body, Spacer(1, 14), Paragraph("SELECTED PROOF OF WORK", styles["Section"]), Paragraph("Featured company research / transparent financial models / documented portfolio methodology / mistake-journal process / print-friendly resume profile", styles["BodySmall"]), Spacer(1, 12), Paragraph(f"Explore the full profile and contact Shy at {SITE}/resume", styles["Deck"])]
    doc.build(story)

if __name__ == "__main__":
    make_resume()
    make_profile()
