from pathlib import Path
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, PageBreak

OUT = Path("public/downloads")
OUT.mkdir(parents=True, exist_ok=True)
SITE = "luna1research.com"
ink, muted, line, accent = map(HexColor, ["#171817", "#62645f", "#d5d3cc", "#466f89"])
navy, pale, white = map(HexColor, ["#111d31", "#eaf2f6", "#ffffff"])
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="Name", fontName="Helvetica", fontSize=28, leading=31, textColor=ink, spaceAfter=3))
styles.add(ParagraphStyle(name="Deck", fontName="Helvetica", fontSize=10, leading=14, textColor=muted))
styles.add(ParagraphStyle(name="Section", fontName="Helvetica-Bold", fontSize=8, leading=10, textColor=accent, spaceBefore=13, spaceAfter=7, tracking=1.4))
styles.add(ParagraphStyle(name="Role", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=ink))
styles.add(ParagraphStyle(name="BodySmall", fontName="Helvetica", fontSize=8.2, leading=11.2, textColor=muted))
styles.add(ParagraphStyle(name="Date", fontName="Helvetica", fontSize=8, leading=11, textColor=muted, alignment=TA_RIGHT))
styles.add(ParagraphStyle(name="ProfileHead", fontName="Helvetica", fontSize=18, leading=22, textColor=ink, spaceAfter=7))
styles.add(ParagraphStyle(name="ProfileSection", fontName="Helvetica-Bold", fontSize=9.5, leading=11.5, textColor=HexColor("#0c6e96")))
styles.add(ParagraphStyle(name="ProfileBody", fontName="Helvetica", fontSize=8.9, leading=11.5, textColor=HexColor("#536176")))
styles.add(ParagraphStyle(name="ProfileBodyDark", fontName="Helvetica", fontSize=8.9, leading=11.5, textColor=navy))
styles.add(ParagraphStyle(name="ProfileRole", fontName="Helvetica-Bold", fontSize=9.2, leading=11.5, textColor=navy))
styles.add(ParagraphStyle(name="ProfileCourse", fontName="Helvetica", fontSize=8, leading=10.5, textColor=HexColor("#536176")))

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
    story += [Paragraph("EDUCATION", styles["Section"]), Paragraph("<b>San Diego State University, Fowler College of Business</b> - B.S. Finance, expected 2027<br/><b>San Diego Miramar College</b> - A.S. Business Administration, 2024", styles["BodySmall"]), Paragraph("ADVANCED FINANCE COURSEWORK", styles["Section"]), Paragraph("<b>Aztec Investment Fund</b> - Equity Research &amp; Portfolio Management", styles["BodySmall"]), Paragraph("CERTIFICATIONS & SKILLS", styles["Section"]), Paragraph("QuickBooks Online Level 1; Bloomberg Market Concepts; Microsoft Excel (completed).<br/>Financial statement analysis, budgeting and forecasting, account reconciliation, financial modeling, valuation, reporting, portfolio analysis, and Python workflows.", styles["BodySmall"])]
    doc.build(story)

def draw_paragraph(pdf, text, x, top, width, style):
    paragraph = Paragraph(text, style)
    _, height = paragraph.wrap(width, 1000)
    paragraph.drawOn(pdf, x, top - height)
    return top - height

def make_profile():
    path = OUT / "shy-lee-one-page-profile.pdf"
    pdf = canvas.Canvas(str(path), pagesize=letter)
    width, height = letter

    pdf.setFillColor(navy)
    pdf.rect(0, 674, width, 118, stroke=0, fill=1)
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 25)
    pdf.drawString(38, 744, "SHY LEE")
    pdf.setFont("Helvetica", 11.5)
    pdf.drawString(38, 718, "FINANCE | EQUITY RESEARCH | FINANCIAL OPERATIONS")
    pdf.setFont("Helvetica-Bold", 10)
    pdf.drawRightString(574, 750, "LUNA1 RESEARCH")
    pdf.setFont("Helvetica", 9)
    pdf.drawRightString(574, 730, f"{SITE}/contact")
    pdf.drawRightString(574, 714, "shyheim.lee.finance@gmail.com")

    pdf.setFillColor(pale)
    pdf.rect(0, 642, width, 32, stroke=0, fill=1)
    pdf.setFillColor(navy)
    pdf.setFont("Helvetica-Bold", 11.5)
    pdf.drawString(38, 653, "Connecting financial statements, operational reality, and investment judgment.")

    left_x, right_x = 38, 320
    left_width, right_width = 244, 254

    top = 620
    top = draw_paragraph(pdf, "CANDIDATE PROFILE", left_x, top, left_width, styles["ProfileSection"]) - 5
    top = draw_paragraph(pdf, "U.S. Army veteran and finance professional with experience across accounting support, mission-critical operations, and investment research. Brings an operator's perspective to valuation, financial analysis, controls, and decision-making.", left_x, top, left_width, styles["ProfileBodyDark"]) - 10
    top = draw_paragraph(pdf, "EXPERIENCE", left_x, top, left_width, styles["ProfileSection"]) - 5
    for title, description in [
        ("Finance Assistant", "Accrual accounting, reconciliations, reporting, board materials, audit trails, and financial record support."),
        ("Data Center Operations", "5+ years supporting mission-critical infrastructure, controls, documentation, service continuity, and customer operations."),
        ("U.S. Army", "Logistics and financial management supporting more than $10M in operational expenditures."),
    ]:
        top = draw_paragraph(pdf, title, left_x, top, left_width, styles["ProfileRole"])
        top = draw_paragraph(pdf, description, left_x, top - 1, left_width, styles["ProfileBody"]) - 5
    top = draw_paragraph(pdf, "EDUCATION", left_x, top, left_width, styles["ProfileSection"]) - 4
    top = draw_paragraph(pdf, "<b>B.S. Finance - San Diego State University, expected 2027</b><br/>A.S. Business Administration - San Diego Miramar College, 2024", left_x, top, left_width, styles["ProfileBody"]) - 7
    top = draw_paragraph(pdf, "ADVANCED FINANCE COURSEWORK", left_x, top, left_width, styles["ProfileSection"]) - 4
    top = draw_paragraph(pdf, "<b>Aztec Investment Fund</b> - Equity Research &amp; Portfolio Management", left_x, top, left_width, styles["ProfileCourse"]) - 7
    top = draw_paragraph(pdf, "CORE TOOLS", left_x, top, left_width, styles["ProfileSection"]) - 4
    draw_paragraph(pdf, "Excel | Financial modeling | QuickBooks Online | Bloomberg Market Concepts | Portfolio analytics | Transaction analytics", left_x, top, left_width, styles["ProfileBody"])

    top = 620
    top = draw_paragraph(pdf, "RESEARCH &amp; ANALYSIS APPROACH", right_x, top, right_width, styles["ProfileSection"]) - 4
    top = draw_paragraph(pdf, "• Fundamentals and valuation<br/>• Industry structure and competitive positioning<br/>• Institutional behavior and technical structure<br/>• Explicit risk rules and thesis updates", right_x, top, right_width, styles["ProfileBody"]) - 7
    top = draw_paragraph(pdf, "SELECTED PROOF OF WORK", right_x, top, right_width, styles["ProfileSection"]) - 4
    top = draw_paragraph(pdf, "• Company research pages and transparent valuation models<br/>• Documented portfolio methodology and mistake-journal process<br/>• Luna1 Transaction Intelligence: upload, analyze, flag discrepancies, and export financial records", right_x, top, right_width, styles["ProfileBody"]) - 7
    top = draw_paragraph(pdf, "PLATFORM DEVELOPMENT", right_x, top, right_width, styles["ProfileSection"]) - 4
    top = draw_paragraph(pdf, "Building Luna1 as a practical finance portfolio that connects equity research, valuation, accounting controls, transaction-level analysis, and recruiter-ready proof of work.", right_x, top, right_width, styles["ProfileBodyDark"]) - 7
    top = draw_paragraph(pdf, "INVESTMENT PHILOSOPHY", right_x, top, right_width, styles["ProfileSection"]) - 4
    draw_paragraph(pdf, "I treat each investment thesis as a working hypothesis, updating the view as financial results, industry conditions, valuation, and risk factors change.", right_x, top, right_width, styles["ProfileBodyDark"])

    pdf.setFillColor(navy)
    pdf.roundRect(38, 52, 536, 58, 8, stroke=0, fill=1)
    pdf.setFillColor(white)
    pdf.setFont("Helvetica-Bold", 10.5)
    pdf.drawString(54, 89, "EXPLORE LUNA1 RESEARCH")
    pdf.setFont("Helvetica", 8.8)
    pdf.drawString(54, 70, "Research, models, development log, and Transaction Intelligence at luna1research.com")
    pdf.setFont("Helvetica-Bold", 8.4)
    pdf.drawRightString(558, 88, "Open to finance, research, FP&A,")
    pdf.drawRightString(558, 75, "and investment roles")

    pdf.setTitle("Shy Lee - One-Page Profile")
    pdf.setAuthor("Shy Lee")
    pdf.setSubject("Finance, equity research, and financial operations profile")
    pdf.save()

if __name__ == "__main__":
    make_resume()
    make_profile()
