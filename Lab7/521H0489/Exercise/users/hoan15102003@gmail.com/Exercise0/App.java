package com.hohuuan;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

/**
 * Hello world!
 *
 */
public class App {
    public static void main(String[] args) {
        ApplicationContext applicationContext = new ClassPathXmlApplicationContext("beans.xml");

        Product product1_1 = applicationContext.getBean("product1", Product.class);
        Product product1_2 = applicationContext.getBean("product1", Product.class);

        Product product2_1 = applicationContext.getBean("product2", Product.class);
        Product product2_2 = applicationContext.getBean("product2", Product.class);

        Product product3_1 = applicationContext.getBean("product3", Product.class);
        Product product3_2 = applicationContext.getBean("product3", Product.class);

        System.out.println("Product 1: " + product1_1);
        System.out.println("Product 2: " + product2_1);
        System.out.println("Product 3: " + product3_1);

        System.out.println("Check singleton of product 1: " + (product1_1.equals(product1_2)));
        System.out.println("Check singleton of product 2: " + (product2_1.equals(product2_2)));
        System.out.println("Check singleton of product 3: " + (product3_1.equals(product3_2)));

    }
}
