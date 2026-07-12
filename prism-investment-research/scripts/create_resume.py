from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.units import inch

OUT="output/pdf/shy-lee-resume.pdf"
ink=HexColor("#171817"); muted=HexColor("#62645f"); line=HexColor("#d5d3cc"); accent=HexColor("#466f89")
doc=SimpleDocTemplate(OUT,pagesize=letter,rightMargin=.65*inch,leftMargin=.65*inch,topMargin=.55*inch,bottomMargin=.55*inch)
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name="Name",fontName="Helvetica",fontSize=28,leading=32,textColor=ink,spaceAfter=4))
styles.add(ParagraphStyle(name="Meta",fontName="Helvetica",fontSize=8.5,leading=12,textColor=muted))
styles.add(ParagraphStyle(name="Section",fontName="Helvetica-Bold",fontSize=8,leading=10,textColor=accent,spaceBefore=14,spaceAfter=8,tracking=1.5))
styles.add(ParagraphStyle(name="Role",fontName="Helvetica-Bold",fontSize=10,leading=13,textColor=ink))
styles.add(ParagraphStyle(name="BodySmall",fontName="Helvetica",fontSize=8.5,leading=12,textColor=muted))
styles.add(ParagraphStyle(name="Date",fontName="Helvetica",fontSize=8,leading=11,textColor=muted,alignment=TA_RIGHT))
story=[]
head=Table([[Paragraph("SHY LEE",styles["Name"]),Paragraph("Escondido, California<br/>(302) 344-9724<br/>leeshyheim@yahoo.com",styles["Meta"])]],colWidths=[4.9*inch,2.3*inch])
head.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("ALIGN",(1,0),(1,0),"RIGHT"),("LINEBELOW",(0,0),(-1,-1),1,line),("BOTTOMPADDING",(0,0),(-1,-1),12)]));story.append(head)
story += [Paragraph("FINANCE PROFESSIONAL / EQUITY RESEARCH",styles["Section"]),Paragraph("Finance professional and U.S. Army veteran with experience in fundamental investment research, financial analysis, nonprofit finance, reconciliation, reporting, and mission-critical operations.",styles["BodySmall"]),Paragraph("PROFESSIONAL EXPERIENCE",styles["Section"])]
roles=[("Coronado Historical Association","Executive & Finance Assistant","May 2026 - Present","Support nonprofit finance, accounting, reporting, executive administration, and operational coordination."),("LightEdge Solutions","Data Center Network Operations Technician","Nov 2020 - Present","Support mission-critical infrastructure, incident response, customer operations, and service reliability."),("United States Army","Supply Specialist & Financial Management Technician","Nov 2015 - May 2019","Managed logistics and financial operations in high-accountability environments; maintained accurate records and supported service members."),("Wilgus Associates","Junior Reconciliation Accountant","Jun 2014 - Jul 2015","Performed account reconciliation, variance research, and financial-record maintenance.")]
for company,role,date,desc in roles:
    row=Table([[Paragraph(f"{company}<br/><font color='#62645f'>{role}</font>",styles["Role"]),Paragraph(date,styles["Date"])]],colWidths=[5.6*inch,1.6*inch])
    row.setStyle(TableStyle([("VALIGN",(0,0),(-1,-1),"TOP"),("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),3)]))
    story.append(KeepTogether([row,Paragraph(desc,styles["BodySmall"]),Spacer(1,7)]))
story += [Paragraph("EDUCATION",styles["Section"]),Paragraph("<b>San Diego State University, Fowler College of Business</b><br/>Bachelor of Science in Finance - Expected 2027",styles["BodySmall"]),Spacer(1,7),Paragraph("<b>San Diego Miramar College</b><br/>Associate of Science in Business Administration - 2024",styles["BodySmall"]),Paragraph("LEADERSHIP & RESEARCH",styles["Section"]),Paragraph("<b>Aztec Investment Fund</b><br/>Fundamental equity research, investment thesis development, and AI infrastructure and data-center value-chain research.",styles["BodySmall"]),Paragraph("AREAS OF INTEREST",styles["Section"]),Paragraph("Investment management  /  Portfolio strategy  /  Financial planning  /  Business analysis  /  AI infrastructure  /  Data centers",styles["BodySmall"])]
doc.build(story)
