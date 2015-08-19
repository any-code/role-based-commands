# role-based-commands

[![Build Status](https://travis-ci.org/any-code/role-based-commands.svg?branch=master)](https://travis-ci.org/any-code/role-based-commands)

> Javascript role-based command abstraction.

* Roles have permissions
* Commands have permissions
* Users are given roles
* A command will execute or not based on the user having a role with one of the command's permissions

## Getting Started

### 1. Installation

``` bash
npm install role-based-commands
```

### 2. Examples

``` javascript
var Controller = require('role-based-commands'),
    roles = {
            root: ['root'],
            admin: ['user.admin'],
            user: ['user.permission.one', 'user.permission.two']
        },
     user;

user = {
    id: 42,
    name: "Foo Bar",
    roles: ['user']
}

// Create a controller and add a command that is executable only to a user with the correct permissions

var ctrl = new Controller(user, roles),
    command = ctrl.command('command.name',['user.admin'], function(some, arguments) {
      // execute some command
      console.log("do %s $s", some, arguments);
    });

// Calling the command 

// using the assigned variable
command(argument1, argument2);

// using the controller's execute method
ctrl.execute('command.name', argument1, argument2);

// the user can't execute the command 
user.roles = ['user'];
ctrl.execute('command.name', argument1, argument2);

// the user can execute the command 
user.roles = ['admin'];
ctrl.execute('command.name', argument1, argument2);
```

## Copyright and license
Copyright (c) 2015, Any Code <lee@anycode.io>

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
