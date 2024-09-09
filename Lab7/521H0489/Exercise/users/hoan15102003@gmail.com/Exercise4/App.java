package com.hohuuan;

import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

import java.util.Scanner;

public class App
{
    public static void main(String[] args) {
        ApplicationContext applicationContext = new AnnotationConfigApplicationContext(AppConfig.class);

        TextEditor textEditor = applicationContext.getBean(TextEditor.class);
        Scanner sc = new Scanner(System.in);
        while (true){
            System.out.print("Enter content: ");
            String content = sc.nextLine();
            System.out.print("Enter file name: ");
            String fileName = sc.nextLine();
            System.out.println("Choose type of file: \n1 " + fileName + ".txt \n2 " + fileName + ".pdf");
            String extension = "";
            while (true){
                int type = sc.nextInt();
                sc.nextLine();
                extension = "";
                if ( type == 1){
                    extension = ".txt";
                    break;
                } else if (type == 2){
                    extension = ".pdf";
                    break;
                } else {
                    System.out.print("Please choose 1 or 2: ");
                }
            }
            textEditor.input(content);
            textEditor.save(fileName + extension );
        }
    }
}
