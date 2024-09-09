package com.hohuuan;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class PlainTextWriter implements TextWriter {
    @Override
    public void write(String fileName, String text) {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
            writer.write(text);
            System.out.println("Plain file created: " + fileName);
        } catch (IOException e) {
            System.out.println("Error writing text to file: " + fileName);
            e.printStackTrace();
        }
    }
}

