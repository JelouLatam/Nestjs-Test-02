/* Creates an application user in the configured MONGO_DB with readWrite role.
   This script runs only on first init when the volume is empty.
   It expects env vars MONGO_INITDB_ROOT_USERNAME / MONGO_INITDB_ROOT_PASSWORD (admin)
   and optionally MONGO_APP_USER / MONGO_APP_PASSWORD to create the app user.
*/

(function () {
    const dbName = process.env.MONGO_DB || process.env.MONGO_INITDB_DATABASE || 'todo_logs';
    const appUser = process.env.MONGO_APP_USER || 'app_user';
    const appPass = process.env.MONGO_APP_PASSWORD || 'app_pass';

    print(`init-mongo: creating app user ${appUser} on db ${dbName}`);

    db = db.getSiblingDB(dbName);

    try {
        // db.getUsers() may return different shapes depending on shell/driver:
        // - an array of users
        // - an object like { users: [...] }
        var raw = db.getUsers();
        var users = Array.isArray(raw) ? raw : (raw && raw.users) ? raw.users : [];
        var exists = users.some(u => u.user === appUser);
        if (!exists) {
            db.createUser({
                user: appUser,
                pwd: appPass,
                roles: [{ role: 'readWrite', db: dbName }]
            });
            print('init-mongo: created user', appUser);
        } else {
            print('init-mongo: app user already exists, skipping');
        }
    } catch (e) {
        print('init-mongo: error while creating user', e && e.stack ? e.stack : e);
    }
})();
