package com.hohuuan;

import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class App 
{
    public static void main( String[] args )
    {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        DatabaseConfig server = context.getBean(DatabaseConfig.class);
        System.out.println(server);

        server.connectSuccess();
    }
}
