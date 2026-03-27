package com.bank.transaction.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI transactionServiceOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("Transaction Service API")
                        .description("Money Transfer and Transactions Management Service")
                        .version("v1.0.0"));
    }
}
