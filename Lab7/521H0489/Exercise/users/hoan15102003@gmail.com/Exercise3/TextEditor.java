package com.hohuuan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public class TextEditor {
    private String text;

    @Autowired
    @Qualifier("pdf")
    private TextWriter pdf;

    @Autowired
    @Qualifier("plain")
    private TextWriter plain;

    public void input(String inputText) {
        text = inputText;
        System.out.println("Received input: " + text);
    }

    public void save(String fileName) {
        int dotIndex = fileName.lastIndexOf('.');
        String fileExtension = fileName.substring(dotIndex + 1);
        if( fileExtension.equals("pdf")){
            pdf.write(fileName, text);
        }
        else {
            plain.write(fileName, text);
        }

    }
}