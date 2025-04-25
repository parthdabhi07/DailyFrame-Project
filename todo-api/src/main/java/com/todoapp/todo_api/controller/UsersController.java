package com.todoapp.todo_api.controller;

import com.todoapp.todo_api.dto.MyRoutineRequest;
import com.todoapp.todo_api.entity.Lists;
import com.todoapp.todo_api.entity.MyRoutine;
import com.todoapp.todo_api.entity.Users;
import com.todoapp.todo_api.jwt.JwtTokenResponse;
import com.todoapp.todo_api.service.UsersService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @GetMapping("/users")
    public ResponseEntity<Users> getUser(@RequestHeader("X-User-Email") String email) {
        Users user = usersService.findById(email);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody @Valid Users user) {
        try {
            String jwtToken = usersService.saveNewUser(user);
            return ResponseEntity.ok(new JwtTokenResponse(jwtToken));
        } catch (RuntimeException e) {
            // 409
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already exists");
        }
    }

//    {
//            "email" : "parth@gmail.com",
//            "password" : "12345678",
//            "username" : "parthdabhi"
//    }

    @GetMapping("/users/lists")
    public ResponseEntity<List<Lists>> getUserLists(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(usersService.retrieveAllListOfUser(email));
    }

    @GetMapping("/users/routines")
    public ResponseEntity<List<MyRoutine>> getAllMyRoutines(@RequestHeader("X-User-Email") String email) {
        return ResponseEntity.ok(usersService.getAllMyRoutines(email));
    }
    @PostMapping("/users/routines")
    public ResponseEntity<MyRoutine> createNewRoutines
            (@RequestHeader("X-User-Email") String email, @RequestBody MyRoutineRequest myRoutineRequest) {

        MyRoutine responseMyRoutine = usersService.createNewRoutine(email, myRoutineRequest);

        return ResponseEntity.ok(responseMyRoutine);
    }

//    {
//            "description" : "chanting radha radha radha",
//            "startTime" : "14:37:31",
//            "endTime" : "16:37:31",
//            "title" : "vrindavan-barsana",
//            "status" : "PENDING"
//    }
}