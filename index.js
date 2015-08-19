var collection = require('javascript-collection-paraphernalia');

function RoleBasedExecutor(user, roles) {
    this.commands = {};
    this.user = user;
    this.roles = roles;
}

RoleBasedExecutor.prototype.getUsersPermissions = function() {
    var permissions = [];
    collection.each(this.roles, function(index, role) {
        if (this.user.roles.indexOf(index) !== -1) {
            permissions = permissions.concat(role);
        }
    }.bind(this));
    return permissions;
}

RoleBasedExecutor.prototype.userHasPermission = function(permissions) {
    var userPermissions = this.getUsersPermissions();
    return userPermissions.indexOf('root') !== -1 || permissions.some(function(item) {
            return userPermissions.indexOf(item) > -1;
        });
}

RoleBasedExecutor.prototype.command = function(action, permissions, privilegedFn, unprivilegedFn) {
    if (unprivilegedFn === undefined) {
        unprivilegedFn = this.defaultInsufficientPermissionExecutor;
    }

    this.commands[action] = function() {
        if (this.userHasPermission(permissions)) {
            return privilegedFn.apply(this, arguments);
        }
        return unprivilegedFn.apply(this, [permissions, action].concat(arguments));
    }.bind(this);

    return this.commands[action];
}

RoleBasedExecutor.prototype.execute = function(action, args) {
    return this.commands[action].apply(this, Array.prototype.slice.call(arguments, 1));
}

RoleBasedExecutor.prototype.defaultInsufficientPermissionExecutor = function(permissions, action) {
    console.log("user %s with roles [%s] tried to execute %s with insufficient permissions", this.user.name,
        this.user.roles.toString(), action)

    throw new Error("Insufficient permissions");
};

module.exports = RoleBasedExecutor;
