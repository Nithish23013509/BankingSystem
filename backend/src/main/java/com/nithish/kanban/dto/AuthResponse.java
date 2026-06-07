package com.nithish.kanban.dto;

public class AuthResponse {
    private String token;
    private String userId;
    private String name;
    private String email;

    public AuthResponse() {}

    public AuthResponse(String token, String userId, String name, String email) {
        this.token = token;
        this.userId = userId;
        this.name = name;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }

    public static class AuthResponseBuilder {
        private String token;
        private String userId;
        private String name;
        private String email;

        public AuthResponseBuilder token(String token) {
            this.token = token;
            return this;
        }

        public AuthResponseBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public AuthResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AuthResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AuthResponse build() {
            AuthResponse authResponse = new AuthResponse();
            authResponse.setToken(token);
            authResponse.setUserId(userId);
            authResponse.setName(name);
            authResponse.setEmail(email);
            return authResponse;
        }
    }
}