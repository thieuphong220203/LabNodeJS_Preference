package com.hohuuan;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
@Component
@Qualifier("plain")
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

