package com.bank.account.util;

import java.util.Random;

public class AccountNumberGenerator {
    
    private static final Random RANDOM = new Random();

    public static String generate() {
        long digits = (long) (RANDOM.nextDouble() * 9_000_000_000L) + 1_000_000_000L;
        return "ACC" + digits;
    }
}
