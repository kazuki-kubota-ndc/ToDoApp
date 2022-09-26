const express = require('express')
const app = express()
const path = require('path');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001

const { getPostgresClient } = require('../db/postgresManager');
const LoginModal = require('./BELoginModal');
const Main = require('./BEMain');
const User = require('./BEUser');
const Pass = require('./BEPass');
const UserEdit = require('./BEUserEdit');
const AddUser = require('./BEAddUser');
const Task = require('./BETask');

app.use(express.static(path.join(__dirname, '../frontend/build')));
// リクエストボディをjsonに変換する
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

/* -------------------- Main.js -------------------- */
app.get("/select_list", Main.select_list);

app.get("/update_task_check", Main.update_task_check);

app.get("/update_sub_check", Main.update_sub_check);

app.post("/upd_task_sort", Main.upd_task_sort);

app.get("/insert_list", Main.insert_list);

app.get("/delete_list", Main.delete_list);

app.get("/update_list", Main.update_list);

app.get("/insert_task", Main.insert_task);

app.get("/delete_task", Main.delete_task);

app.get("/update_task", Main.update_task);

app.get("/insert_sub", Main.insert_sub);

app.get("/update_sub", Main.update_sub);



/* -------------------- LoginModal.js -------------------- */
app.get("/login", LoginModal.login);



/* -------------------- UserModal.js -------------------- */
app.get("/update_login_id", User.update_login_id);

app.get("/update_user_name", User.update_user_name);

app.get("/update_admin", User.update_admin);

app.get("/update_size", User.update_size);

app.get("/delete_user", User.delete_user);



/* -------------------- PassModal.js -------------------- */
app.get("/update_pass", Pass.update_pass);



/* -------------------- UserEditModal.js -------------------- */
app.get("/select_user", UserEdit.select_user);



/* -------------------- AddUserModal.js -------------------- */
app.get("/insert_user", AddUser.insert_user);

app.get("/update_user", AddUser.update_user);

app.get("/select_pass", AddUser.select_pass);



/* -------------------- TaskModal.js -------------------- */
app.get("/select_task", Task.select_task);

app.get("/select_sub", Task.select_sub);

app.get("/delete_sub", Task.delete_sub);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});

app.listen(port, () => {
  console.log(`listening on *:${port}`);
});