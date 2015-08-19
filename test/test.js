var obj = require('javascript-object-paraphernalia'),
    RoleBasedExecutor = require('../index');

var roles = {
        root: ['root'],
        admin: ['user.admin'],
        user: ['user.owner']
    },
    user = {
        id: 42,
        name: "Foo Bar",
        roles: []
    },
    controller, rootAccessFunc, userAccessFunc;

exports.setUp = function(callback) {
    controller = new RoleBasedExecutor(user, roles);
    rootAccessFunc = controller.command('users.user.make', ['*'], function(id, name) {
        return "root function called";
    });
    userAccessFunc = controller.command('users.user.view', ['user.owner'], function(id, name) {
        return "user function called";
    });

    callback();
}

exports.testWithReturnCommands = function(test) {
    obj.apply(user, {roles: ['root']});
    test.equals(rootAccessFunc(user.id, user.name), 'root function called', 'the expected function was not called');
    test.equals(userAccessFunc(user.id, user.name), 'user function called', 'the expected function was not called');

    obj.apply(user, {roles: ['user', 'admin']});
    test.throws(function() { rootAccessFunc(user.id, user.name) }, "Insufficent permissions", 'the expected function was not called');
    test.equals(userAccessFunc(user.id, user.name), 'user function called', 'the expected function was not called');

    test.done();
}

exports.testWithExecuteMethod = function(test) {
    obj.apply(user, {roles: ['root']});
    test.equals(controller.execute('users.user.make', user.id, user.name), 'root function called', 'the expected function was not called');
    test.equals(controller.execute('users.user.view', user.id, user.name), 'user function called', 'the expected function was not called');

    obj.apply(user, {roles: ['user', 'admin']});
    test.throws(function() { controller.execute('users.user.make', user.id, user.name) }, "Insufficent permissions", 'the expected function was not called');
    test.equals(controller.execute('users.user.view', user.id, user.name), 'user function called', 'the expected function was not called');

    test.done();
}
