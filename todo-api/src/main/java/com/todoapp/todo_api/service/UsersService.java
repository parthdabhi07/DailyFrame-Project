package com.todoapp.todo_api.service;

import com.todoapp.todo_api.dto.MyRoutineRequest;
import com.todoapp.todo_api.entity.Lists;
import com.todoapp.todo_api.entity.MyRoutine;
import com.todoapp.todo_api.entity.Users;
import com.todoapp.todo_api.exceptions.UserNotFoundException;
import com.todoapp.todo_api.jwt.JwtTokenService;
import com.todoapp.todo_api.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service("usersService")
public class UsersService {

    @Autowired
    private UsersRepository usersRepository;

    private ListsService listsService;
    @Autowired
    private MyRoutineService myRoutinService;

    @Autowired
    private JwtTokenService jwtTokenService;

    @Autowired
    private AuthenticationManager authenticationManager;

    public UsersService(ListsService listsService) {
        this.listsService = listsService;
    }

    public Users findById(String email) {
        Optional<Users> user = validateUser(email);
        return user.get();
    }

    public Optional<Users> validateUser(String email) {
        Optional<Users> user = usersRepository.findById(email);
        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found with email : " + email);
        }
        return user;
    }

    public String saveNewUser(Users user) {
        if(usersRepository.findById(user.getEmail()).isPresent()){
            throw new RuntimeException("User already exists!");
        }

        usersRepository.save(user);
        myRoutinService.createDefaultMyRoutine(user);

        // Authenticate the user
        var authenticationToken = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        var authentication = authenticationManager.authenticate(authenticationToken);

        // Generate JWT token after successful registration
        return jwtTokenService.generateToken(authentication);
    }

    public List<Lists> retrieveAllListOfUser(String email) {
        validateUser(email);
        return listsService.getAllLists(email);
    }

    public List<MyRoutine> getAllMyRoutines(String email) {
        validateUser(email);
        return myRoutinService.getAllMyRoutinesOfUser(email);
    }

    public MyRoutine createNewRoutine(String email, MyRoutineRequest myRoutineRequest) {
        Users user = validateUser(email).get();
        return myRoutinService.createNewRoutineOfUser(email, myRoutineRequest, user);
    }
}
