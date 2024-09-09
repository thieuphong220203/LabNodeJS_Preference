package com.hohuuan;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {
    @Bean
    @Qualifier("plain")
    public TextWriter getPlainTextWriter() {
        return new PlainTextWriter();
    }

    @Bean
    @Qualifier("pdf")
    public TextWriter getPdfTextWriter() {
        return new PdfTextWriter();
    }

    @Bean
    public TextEditor textEditor() {
        return new TextEditor();
    }
}