package com.hohuuan;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.PropertySources;

@ComponentScan(basePackages = "com.hohuuan")
@PropertySources({
        @PropertySource("classpath:application.properties")
})
public class AppConfig {

}
