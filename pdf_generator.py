import os
import io
import base64
import tempfile
from datetime import datetime
from PIL import Image

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, Table, TableStyle, Image as RLImage, PageBreak
)

# --- Cyber Theme Colors ---
CYBER_BG = colors.HexColor("#060b14")
CYBER_CYAN = colors.HexColor("#00ff88")
CYBER_BLUE = colors.HexColor("#00aaff")
CYBER_RED = colors.HexColor("#ff3333")
CYBER_PURPLE = colors.HexColor("#7c3aed")
CYBER_ORANGE = colors.HexColor("#ff6600")
CYBER_GRAY = colors.HexColor("#c9d1d9")
CYBER_DARK_GRAY = colors.HexColor("#111927")
CYBER_TEXT = colors.HexColor("#e2e8f0")

def draw_page_decorations(canvas_obj, doc):
    """Draws background and page headers/footers before flowables are placed."""
    canvas_obj.saveState()
    
    # 1. Fill Background with Sleek Cyber Navy-Dark
    canvas_obj.setFillColor(CYBER_BG)
    canvas_obj.rect(0, 0, doc.pagesize[0], doc.pagesize[1], fill=1, stroke=0)
    
    # 2. Centered Rotated Watermark
    canvas_obj.setFillColor(colors.Color(0, 0.66, 1, alpha=0.02)) # Extremely subtle
    canvas_obj.setFont("Helvetica-Bold", 50)
    canvas_obj.saveState()
    canvas_obj.translate(doc.pagesize[0] / 2, doc.pagesize[1] / 2)
    canvas_obj.rotate(35)
    canvas_obj.drawCentredString(0, 0, "AI CYBER FORENSICS SECURE")
    canvas_obj.restoreState()
    
    # 3. Header Styling
    canvas_obj.setFillColor(CYBER_CYAN)
    canvas_obj.setFont("Helvetica-Bold", 8)
    canvas_obj.drawString(doc.leftMargin, doc.pagesize[1] - 0.4 * inch, "CONFIDENTIAL DIGITAL FORENSIC EVIDENCE REPORT")
    
    scan_id = getattr(doc, 'scan_data', {}).get('scan_id', 'N/A')
    canvas_obj.drawRightString(doc.pagesize[0] - doc.rightMargin, doc.pagesize[1] - 0.4 * inch, f"SCAN_ID: {scan_id}")
    
    # Header Accent Line
    canvas_obj.setStrokeColor(CYBER_BLUE)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(doc.leftMargin, doc.pagesize[1] - 0.45 * inch, doc.pagesize[0] - doc.rightMargin, doc.pagesize[1] - 0.45 * inch)
    
    # 4. Footer Styling
    canvas_obj.setStrokeColor(colors.Color(0, 0.66, 1, alpha=0.2))
    canvas_obj.line(doc.leftMargin, 0.75 * inch, doc.pagesize[0] - doc.rightMargin, 0.75 * inch)
    
    canvas_obj.setFillColor(CYBER_GRAY)
    canvas_obj.setFont("Helvetica", 7)
    canvas_obj.drawString(doc.leftMargin, 0.55 * inch, "UNIFIED FORENSIC INTELLIGENCE ENGINE v2.4.1 // SECURE ACQUISITION")
    canvas_obj.drawRightString(doc.pagesize[0] - doc.rightMargin, 0.55 * inch, f"PAGE {doc.page} // CLASS: RESTRICTED")
    
    canvas_obj.restoreState()

def _decode_b64_image(b64_str, max_width=5.5*inch, max_height=3.5*inch):
    """
    Decodes a base64 string safely to a temporary JPG file to prevent ReportLab I/O errors.
    Returns (RLImage, temp_file_path) or None.
    """
    if not b64_str:
        return None
    try:
        # Strip data:image/png;base64 prefix if present
        if "," in b64_str:
            b64_str = b64_str.split(",")[1]
            
        img_data = base64.b64decode(b64_str)
        img_io = io.BytesIO(img_data)
        img = Image.open(img_io)
        
        # Convert to RGB mode (avoid ReportLab transparency channel bugs)
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            img = img.convert('RGB')
            
        # Write to secure temp file
        fd, temp_path = tempfile.mkstemp(suffix=".jpg")
        try:
            with os.fdopen(fd, 'wb') as tmp_file:
                img.save(tmp_file, format='JPEG', quality=85)
        except Exception:
            os.close(fd)
            raise
            
        rl_img = RLImage(temp_path)
        aspect = rl_img.imageWidth / float(rl_img.imageHeight)
        
        # Scale image keeping aspect ratio
        if max_width / aspect <= max_height:
            rl_img.drawWidth = max_width
            rl_img.drawHeight = max_width / aspect
        else:
            rl_img.drawHeight = max_height
            rl_img.drawWidth = max_height * aspect
            
        return rl_img, temp_path
    except Exception as e:
        print(f"Error decoding image: {e}")
        return None

def generate_enterprise_pdf(scan_data: dict) -> bytes:
    """
    Generates a premium, enterprise-grade dark-themed forensic PDF report.
    Automatically handles temp file creation and cleanup.
    """
    temp_files = []
    buffer = io.BytesIO()
    
    try:
        doc = BaseDocTemplate(
            buffer, 
            pagesize=letter,
            leftMargin=0.75*inch, rightMargin=0.75*inch,
            topMargin=0.85*inch, bottomMargin=0.95*inch
        )
        
        doc.scan_data = scan_data
        
        # Define printable frame area
        frame = Frame(
            doc.leftMargin, doc.bottomMargin, doc.width, doc.height, 
            id='normal_frame',
            topPadding=0.2*inch, bottomPadding=0.2*inch,
            leftPadding=0, rightPadding=0
        )
        
        template = PageTemplate(
            id='cyber_template', 
            frames=frame, 
            onPage=draw_page_decorations
        )
        doc.addPageTemplates([template])
        
        story = []
        styles = getSampleStyleSheet()
        
        # Define Premium Typography Styles
        title_style = ParagraphStyle(
            'TitleStyle', parent=styles['Heading1'],
            fontName='Helvetica-Bold', fontSize=22, textColor=CYBER_CYAN,
            spaceAfter=15, alignment=1, leading=26
        )
        subtitle_style = ParagraphStyle(
            'SubTitleStyle', parent=styles['Normal'],
            fontName='Helvetica-Bold', fontSize=10, textColor=CYBER_BLUE,
            spaceAfter=25, alignment=1, leading=12
        )
        h2_style = ParagraphStyle(
            'H2Style', parent=styles['Heading2'],
            fontName='Helvetica-Bold', fontSize=12, textColor=CYBER_BLUE,
            spaceBefore=18, spaceAfter=8, leading=16,
            backColor=CYBER_DARK_GRAY, borderPadding=6
        )
        normal_style = ParagraphStyle(
            'NormalStyle', parent=styles['Normal'],
            fontName='Helvetica', fontSize=9.5, textColor=CYBER_TEXT,
            spaceAfter=8, leading=14
        )
        verdict_banner_style = ParagraphStyle(
            'VerdictBanner', parent=styles['Normal'],
            fontName='Helvetica-Bold', fontSize=14, textColor=CYBER_RED if scan_data.get('is_fake') else CYBER_CYAN,
            spaceAfter=6, alignment=1, leading=16
        )
        meta_label_style = ParagraphStyle(
            'MetaLabel', parent=styles['Normal'],
            fontName='Helvetica-Bold', fontSize=9, textColor=CYBER_CYAN,
            leading=12
        )
        meta_value_style = ParagraphStyle(
            'MetaVal', parent=styles['Normal'],
            fontName='Helvetica', fontSize=9, textColor=CYBER_TEXT,
            leading=12
        )
        bullet_style = ParagraphStyle(
            'BulletText', parent=styles['Normal'],
            fontName='Helvetica', fontSize=9, textColor=CYBER_TEXT,
            leftIndent=15, firstLineIndent=-10, spaceAfter=4, leading=12
        )
        
        # 1. REPORT HEADER (COVER SECTION)
        story.append(Spacer(1, 0.2*inch))
        story.append(Paragraph("AI CYBER FORENSIC INTELLIGENCE LAB", title_style))
        story.append(Paragraph("[ DEEPFAKE SCAN & SYNTHETIC ANOMALY ASSESSMENT REPORT ]", subtitle_style))
        
        # 2. CENTRAL VERDICT PANEL
        is_fake = scan_data.get('is_fake', False)
        verdict_color = CYBER_RED if is_fake else CYBER_CYAN
        verdict_title = scan_data.get('verdict_title') or ("DEEPFAKE DETECTED" if is_fake else "AUTHENTIC MEDIA")
        conf = scan_data.get('confidence', 0.0)
        risk = scan_data.get('threat_level') or scan_data.get('risk_level', 'N/A')
        fake_prob = scan_data.get('fake_probability', conf if is_fake else (100 - conf))
        real_prob = scan_data.get('real_probability', (100 - conf) if is_fake else conf)
        
        verdict_html = f"FINAL FORENSIC VERDICT: {verdict_title.upper()}"
        story.append(Paragraph(verdict_html, verdict_banner_style))
        
        score_val = scan_data.get('fake_score') or scan_data.get('composite_score') or (conf if is_fake else (100 - conf))
        verdict_summary_html = (
            f"<b>Forensic Severity:</b> <font color='{verdict_color.hexval()}'>{risk.upper()}</font> &nbsp;|&nbsp; "
            f"<b>Confidence:</b> {conf:.1f}% &nbsp;|&nbsp; "
            f"<b>Composite Threat Score:</b> {score_val:.1f}/100"
        )
        story.append(Paragraph(verdict_summary_html, ParagraphStyle('VSub', parent=normal_style, alignment=1)))
        story.append(Spacer(1, 0.15*inch))
        
        # 3. EXECUTIVE SUMMARY
        story.append(Paragraph("I // EXECUTIVE FORENSIC SUMMARY", h2_style))
        media_type = scan_data.get('media_type', 'media').upper()
        summary_text = (
            f"The digital forensic intelligence pipeline ingested file <b>'{scan_data.get('filename', 'Unknown')}'</b> "
            f"and routed it to the <b>{media_type} Deepfake Detection Matrix</b>. A comprehensive analysis "
            f"aggregating deep spatial, frequency, temporal, and biological classifiers was conducted. "
            f"The final composite analysis indicates a <b>{fake_prob:.1f}%</b> probability of synthetic/manipulated origin "
            f"and <b>{real_prob:.1f}%</b> probability of genuine acquisition. "
        )
        if is_fake:
            summary_text += (
                f"Statistical anomalies in spectral distribution, high frequency residual fingerprints, "
                f"and geometric alignment exceed structural baseline thresholds, confirming the asset is a deepfake."
            )
        else:
            summary_text += (
                f"All metrics remain within standard biological, optics, and compression tolerances, "
                f"indicating no definitive signs of synthetic manipulation or generative editing."
            )
        story.append(Paragraph(summary_text, normal_style))
        
        # 4. EVIDENCE METADATA
        story.append(Paragraph("II // DIGITAL EVIDENCE METADATA", h2_style))
        
        meta_rows = [
            [Paragraph("SCAN IDENTIFIER", meta_label_style), Paragraph(scan_data.get('scan_id', 'N/A'), meta_value_style)],
            [Paragraph("ACQUISITION TIME", meta_label_style), Paragraph(scan_data.get('timestamp', datetime.now().strftime("%Y-%m-%d %H:%M:%S")), meta_value_style)],
            [Paragraph("ORIGINAL FILENAME", meta_label_style), Paragraph(scan_data.get('filename', 'Unknown'), meta_value_style)],
            [Paragraph("EVIDENCE ROUTING", meta_label_style), Paragraph(f"MODALITY ENGINE -> [ {media_type} MODE ]", meta_value_style)],
        ]
        
        meta_table = Table(meta_rows, colWidths=[2.2*inch, 4.8*inch])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,-1), CYBER_DARK_GRAY),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.Color(0, 0.66, 1, alpha=0.25)),
            ('PADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(meta_table)
        
        # 5. ENGINE TELEMETRY
        story.append(Paragraph("III // AGGREGATED ENGINE TELEMETRY", h2_style))
        engines = scan_data.get('engine_results') or scan_data.get('engines', {})
        
        engine_table_data = [[
            Paragraph("FORENSIC ENGINE MODULE", meta_label_style), 
            Paragraph("SCORE", meta_label_style), 
            Paragraph("STATUS FLAG", meta_label_style), 
            Paragraph("TELEMETRY BRIEF", meta_label_style)
        ]]
        
        for eng_name, eng_res in engines.items():
            if isinstance(eng_res, dict):
                score = eng_res.get('score', 0.0)
                status = eng_res.get('status', 'N/A')
                summary = eng_res.get('summary', '')[:65]
            else:
                score = float(eng_res)
                status = 'VERIFIED' if score < 50 else 'SUSPICIOUS'
                summary = 'Legacy heuristic execution output.'
                
            score_col = CYBER_CYAN if score < 50 else (CYBER_ORANGE if score < 75 else CYBER_RED)
            score_p = Paragraph(f"<font color='{score_col.hexval()}'><b>{score:.1f}/100</b></font>", meta_value_style)
            
            engine_table_data.append([
                Paragraph(eng_name.replace("_", " ").upper(), meta_value_style),
                score_p,
                Paragraph(status.upper(), meta_value_style),
                Paragraph(summary, meta_value_style)
            ])
            
        eng_table = Table(engine_table_data, colWidths=[1.8*inch, 0.8*inch, 1.4*inch, 3*inch])
        eng_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.Color(0, 0.66, 1, alpha=0.15)),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('GRID', (0,0), (-1,-1), 0.5, colors.Color(0, 0.66, 1, alpha=0.2)),
            ('PADDING', (0,0), (-1,-1), 5),
        ]))
        story.append(eng_table)
        
        # 6. RISK ASSESSMENT & THREAT CLASSIFICATION
        story.append(Paragraph("IV // RISK ASSESSMENT & THREAT CLASSIFICATION", h2_style))
        if is_fake:
            story.append(Paragraph(
                f"• <b>Threat Classification:</b> <font color='{CYBER_RED.hexval()}'>HIGH SEVERITY GENERATIVE DEEPFAKE</font><br/>"
                f"• <b>Primary Attack Vector:</b> AI Face Swap / Voice Cloning Synthesis.<br/>"
                f"• <b>Exploitation Vector:</b> Spectral manipulation indicates artificial high-frequency grid imposition.<br/>"
                f"• <b>Authenticity Integrity:</b> FAILED. Structural consistency violated in {len([e for e in engines.values() if isinstance(e, dict) and e.get('score', 0) > 50])} neural nodes.",
                bullet_style
            ))
        else:
            story.append(Paragraph(
                f"• <b>Threat Classification:</b> <font color='{CYBER_CYAN.hexval()}'>CLEAN / AUTHENTIC</font><br/>"
                f"• <b>Integrity Rating:</b> PASS. Natural signal distribution confirmed.<br/>"
                f"• <b>Noise Baseline:</b> Natural sensors noise profile matched completely.<br/>"
                f"• <b>Threat Rating:</b> MINIMAL RISK.",
                bullet_style
            ))
            
        story.append(PageBreak())
        
        # 7. VISUAL EVIDENCE & DIGITAL ARTIFACTS
        story.append(Paragraph("V // DIGITAL FORENSIC VISUAL EVIDENCE", h2_style))
        
        evidence_inserted = False
        images = scan_data.get('img_b64', {})
        
        if media_type == 'IMAGE':
            for key, title in [
                ("bbox", "01 // Face Boundary & Region of Interest (ROI)"),
                ("mesh", "02 // Facial Coordinate Geometry Mapping (468-PT Mesh)"),
                ("ela", "03 // Error Level Analysis (ELA) Splicing Heatmap"),
                ("fft", "04 // Two-Dimensional Fast Fourier Transform (FFT) Spectrum"),
                ("lbp", "05 // Local Binary Pattern (LBP) Skin Texture Entropy Map"),
                ("col", "06 // Boundary Chrominance & Color Delta Distribution")
            ]:
                if key in images and images[key]:
                    story.append(Paragraph(title, meta_label_style))
                    story.append(Spacer(1, 0.05*inch))
                    res = _decode_b64_image(images[key], max_width=5.5*inch, max_height=2.4*inch)
                    if res:
                        rl_img, tpath = res
                        temp_files.append(tpath)
                        story.append(rl_img)
                        story.append(Spacer(1, 0.12*inch))
                        evidence_inserted = True
                        
        elif media_type == 'VIDEO':
            if 'timeline' in images and images['timeline']:
                story.append(Paragraph("01 // Composite Temporal Anomaly Timeline Chart", meta_label_style))
                story.append(Spacer(1, 0.05*inch))
                res = _decode_b64_image(images['timeline'], max_width=5.5*inch, max_height=2.3*inch)
                if res:
                    rl_img, tpath = res
                    temp_files.append(tpath)
                    story.append(rl_img)
                    story.append(Spacer(1, 0.12*inch))
                    evidence_inserted = True
                    
            sus_frames = scan_data.get('sus_frames', [])
            if sus_frames:
                story.append(Paragraph("02 // Extracted Flagged Frame Anomaly Preview (Sequential Highlights)", meta_label_style))
                story.append(Spacer(1, 0.05*inch))
                
                # Combine up to 3 suspicious frames horizontally in a table
                row_cells = []
                for idx, frame_b64 in enumerate(sus_frames[:3]):
                    res = _decode_b64_image(frame_b64, max_width=2.1*inch, max_height=2.1*inch)
                    if res:
                        rl_img, tpath = res
                        temp_files.append(tpath)
                        row_cells.append(rl_img)
                        
                if row_cells:
                    tbl = Table([row_cells], colWidths=[2.3*inch] * len(row_cells))
                    tbl.setStyle(TableStyle([
                        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                        ('GRID', (0,0), (-1,-1), 1, CYBER_RED),
                        ('PADDING', (0,0), (-1,-1), 4),
                    ]))
                    story.append(tbl)
                    story.append(Spacer(1, 0.12*inch))
                    evidence_inserted = True
                    
        elif media_type == 'AUDIO':
            for key, title in [
                ("spectrogram", "01 // Neural Voice Spectral Distribution Map"),
                ("mfcc", "02 // Mel-Frequency Cepstral Coefficients (MFCC) Fingerprint")
            ]:
                if key in images and images[key]:
                    story.append(Paragraph(title, meta_label_style))
                    story.append(Spacer(1, 0.05*inch))
                    res = _decode_b64_image(images[key], max_width=5.5*inch, max_height=2.3*inch)
                    if res:
                        rl_img, tpath = res
                        temp_files.append(tpath)
                        story.append(rl_img)
                        story.append(Spacer(1, 0.12*inch))
                        evidence_inserted = True
                        
        if not evidence_inserted:
            story.append(Paragraph("No physical spectral/visual anomaly charts generated for this run.", normal_style))
            
        # 8. RECOMMENDATIONS & SECURITY ACTIONS
        story.append(Paragraph("VI // RECOMMENDATIONS & ACTIONS", h2_style))
        if is_fake:
            story.append(Paragraph(
                "1. <b>Isolate Evidence:</b> Retain original container structure immediately; do not compress or convert.<br/>"
                "2. <b>Chain of Custody:</b> Record all acquisition metadata, sensor parameters, and cryptographically sign forensic outputs.<br/>"
                "3. <b>Restrict Dissemination:</b> Securely restrict the replication/distribution of the flagged asset.<br/>"
                "4. <b>Cross-Verification:</b> Cross-analyze biometric patterns with verified identity keys.",
                bullet_style
            ))
        else:
            story.append(Paragraph(
                "1. <b>Standard Archiving:</b> Standard backup of authentic media can proceed.<br/>"
                "2. <b>Sensor Validation:</b> Optical sensor fingerprints matched structural expectations.<br/>"
                "3. <b>Future Scanning:</b> Schedule routine recurring deepfake scanning on subsequent edits.",
                bullet_style
            ))
            
        # Build Document
        doc.build(story)
        return buffer.getvalue()
        
    finally:
        # Secure cleanup: Delete all temporary image files created during PDF generation
        for path in temp_files:
            try:
                if os.path.exists(path):
                    os.unlink(path)
            except Exception as e:
                print(f"Error cleaning up temp file {path}: {e}")
