package com.hohuuan;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Qualifier("pdf")
public class PdfTextWriter implements TextWriter {
    @Override
    public void write(String fileName, String text) {
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.TIMES_ROMAN, 12);
                contentStream.newLineAtOffset(25, 700);
                contentStream.showText(text);
                contentStream.endText();
            }

            document.save(fileName);
            System.out.println("PDF file created: " + fileName);
        } catch (IOException e) {
            System.out.println("Error creating PDF file: " + fileName);
            e.printStackTrace();
        }
    }
}