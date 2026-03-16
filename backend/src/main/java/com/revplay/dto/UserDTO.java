package com.revplay.dto;

import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private String displayName;
    private String bio;
    private String profilePicture;
    private String role;
}
