package com.hohuuan;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;


@Component
public class DatabaseConfig {

    @Value("${app.name}")
    private String name;

    @Value("${app.version")
    private String version;

    @Value("${app.url}")
    private String url;

    @Value("${app.username}")
    private String username;

    @Value("${app.password}")
    private String password;

    @Value("${app.database}")
    private String database;

    public DatabaseConfig(){
        System.out.println("Connecting..");
    }

    public DatabaseConfig(String name, String version, String url, String username, String password, String database) {
        this.name = name;
        this.version = version;
        this.url = url;
        this.username = username;
        this.password = password;
        this.database = database;
    }

    public void connectSuccess(){
        System.out.println("Connect Successfully");
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    @Override
    public String toString() {
        return "DatabaseConfig{" +
                "name='" + name + '\'' +
                ", version='" + version + '\'' +
                ", url='" + url + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", database='" + database + '\'' +
                '}';
    }
}
