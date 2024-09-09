package com.hohuuan;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

@Configuration
public class BeanConfig {

    @Bean
    @Scope("prototype")
    public Product product1(){
        Product p1 = new Product();
        p1.setId(1);
        p1.setName("Iphone 15");
        p1.setColor("Blue");
        p1.setPrice(1400);
        p1.setCountry("USA");
        return p1;
    }

    @Bean
    @Scope("singleton")
    public Product product2(){;
        Product p2 = new Product(2, "Iphone 15 Pro", 1800,"Gray", "USA");
        return p2;
    }
}
