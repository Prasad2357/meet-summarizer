from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from io import BytesIO

def generate_summary_pdf(summary_data: dict) -> bytes:
    """
    Generate a PDF from meeting summary data using ReportLab
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, 
                          rightMargin=72, leftMargin=72,
                          topMargin=72, bottomMargin=18)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#1a1a1a'),
        spaceAfter=30,
        alignment=TA_CENTER
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#333333'),
        spaceAfter=12,
        spaceBefore=12
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        leading=14,
        spaceAfter=12
    )
    
    # Title
    elements.append(Paragraph("Meeting Summary", title_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Executive Summary Section
    if summary_data.get('executive_summary'):
        elements.append(Paragraph("Executive Summary", heading_style))
        elements.append(Paragraph(summary_data['executive_summary'], body_style))
        elements.append(Spacer(1, 0.3*inch))
    
    # Action Items Section
    if summary_data.get('action_items'):
        elements.append(Paragraph("Action Items", heading_style))
        elements.append(Spacer(1, 0.1*inch))
        
        # Create table data
        table_data = [['#', 'Task', 'Owner', 'Priority', 'Due Date']]
        
        for idx, item in enumerate(summary_data['action_items'], 1):
            task = item.get('task', 'N/A')
            owner = item.get('owner', 'Unassigned')
            priority = item.get('priority', 'Medium')
            due_date = item.get('due_date', 'Not set')
            
            table_data.append([
                str(idx),
                Paragraph(task, body_style),
                owner,
                priority,
                due_date
            ])
        
        # Create table
        table = Table(table_data, colWidths=[0.5*inch, 3*inch, 1.2*inch, 0.8*inch, 1*inch])
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4A5568')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 11),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f7fafc')])
        ]))
        
        elements.append(table)
        elements.append(Spacer(1, 0.3*inch))
    
    # Follow-ups Section
    if summary_data.get('follow_up_needed'):
        elements.append(PageBreak())
        elements.append(Paragraph("Follow-up Items", heading_style))
        elements.append(Spacer(1, 0.1*inch))
        
        follow_ups = summary_data['follow_up_needed']
        
        # Immediate
        if follow_ups.get('immediate'):
            elements.append(Paragraph("<b>Immediate:</b>", body_style))
            for item in follow_ups['immediate']:
                elements.append(Paragraph(f"• {item}", body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # This Week
        if follow_ups.get('this_week'):
            elements.append(Paragraph("<b>This Week:</b>", body_style))
            for item in follow_ups['this_week']:
                elements.append(Paragraph(f"• {item}", body_style))
            elements.append(Spacer(1, 0.2*inch))
        
        # Later
        if follow_ups.get('later'):
            elements.append(Paragraph("<b>Later:</b>", body_style))
            for item in follow_ups['later']:
                elements.append(Paragraph(f"• {item}", body_style))
    
    # Build PDF
    doc.build(elements)
    
    # Get the value of the BytesIO buffer and return it
    pdf_bytes = buffer.getvalue()
    buffer.close()
    
    return pdf_bytes
