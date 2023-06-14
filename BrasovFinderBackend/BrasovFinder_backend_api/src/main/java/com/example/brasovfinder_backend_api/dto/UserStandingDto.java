package com.example.brasovfinder_backend_api.dto;


import com.example.brasovfinder_backend_api.user.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class UserStandingDto {
    private Integer id;
    private String username;
    private Double personal_score;
    private Integer position;

    public static UserStandingDto toDto(User user, int position){
        return UserStandingDto.builder().id(user.getId())
                .username(user.getUsername())
                .personal_score(user.getPersonal_score())
                .position(position)
                .build();
    }
}
