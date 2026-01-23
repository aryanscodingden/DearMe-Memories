import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { marked } from "marked";
import { headers } from "next/headers";

export async function POST(req: Request) {
    try {
        const {markdown} = await req.json();

        if (!markdown) {
            return NextResponse.json({error: "Missing markdown"}, {status: 400});
        }

        const html = await marked.parse(markdown);
        let plainText = html.replace(/<[^>]*>/g, "").trim();
        
        plainText = plainText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '') // Emojis
                             .replace(/[\u{2600}-\u{26FF}]/gu, '')  // Misc symbols
                             .replace(/[\u{2700}-\u{27BF}]/gu, '')  // Dingbats
                             .replace(/[\u{FE00}-\u{FE0F}]/gu, '')  // Variation selectors
                             .replace(/[\u{1F000}-\u{1F02F}]/gu, '') // Mahjong tiles
                             .replace(/[\u{1F0A0}-\u{1F0FF}]/gu, '') // Playing cards
                             .replace(/[^\x00-\xFF]/g, '');         // Keep only ASCII-compatible chars

        const pdf = await PDFDocument.create();
        let page = pdf.addPage([595, 842]);
        const {width, height} = page.getSize();

        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const fontSize = 12;
        const lineHeight = 20;
        const margin = 40;
        const maxWidth = width - (margin * 2);

        const lines = plainText.split("\n");
        let y = height - margin;

        lines.forEach((line: string) => {
            if (!line.trim()) {
                y -= lineHeight / 2;
                return;
            }
            const words = line.split(" ");
            let currentLine = "";

            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                
                if (!word.trim()) continue;
                
                const textWidth = font.widthOfTextAtSize(testLine, fontSize);

                if (textWidth > maxWidth && currentLine) {

                    if (y < margin + lineHeight) {
                        page = pdf.addPage([595, 842]);
                        y = height - margin;
                    }

                    try {
                        page.drawText(currentLine, {
                            x: margin,
                            y,
                            size: fontSize,
                            font,
                            color: rgb(0.2, 0.2, 0.2),
                        });
                    } catch (e) {
                        console.warn("Skipping line due to encoding error:", currentLine);
                    }
                    y -= lineHeight;
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }

            if (currentLine) {
                if (y < margin + lineHeight) {
                    page = pdf.addPage([595, 842]);
                    y = height - margin;
                }

                try {
                    page.drawText(currentLine, {
                        x: margin,
                        y,
                        size: fontSize,
                        font,
                        color: rgb(0.2, 0.2, 0.2),
                    });
                } catch (e) {
                    console.warn("Skipping line due to encoding error:", currentLine);
                }
                y -= lineHeight;
            }
        });

        const pdfBytes = await pdf.save();
        const buffer = Buffer.from(pdfBytes);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="report.pdf"',
            },
        });
    } catch (err: any) {
        console.error("PDF Generation Error:", err);
        return NextResponse.json({
            error: "Failed PDF generation", 
            details: err.message || String(err)
        }, {status: 500});
    }
}
