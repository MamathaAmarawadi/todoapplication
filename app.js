const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () =>
      console.log("Server Running at http://localhost:3001/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

//get

//app.get("/todos/", async (request, response) => {
// const todoQuery = `select
// * from todo;`;
//const tableDetails = await db.all(todoQuery);
//response.send(tableDetails);
//});

//get1
app.get("/todos/", async (request, response) => {
  const { status } = request.query;
  const todoQuery = `select
    * from todo
    where status='${status}';`;
  const tableDetails = await db.all(todoQuery);
  response.send(tableDetails);
});

//get 2
app.get("/todos/", async (request, response) => {
  const { priority } = request.query;
  const todoQuery = `select
  * from todo
  where priority='${priority}';`;
  const tableDetails = await db.all(todoQuery);
  const { id, todo, status } = tableDetails;
  response.send(id);
});

//get 3

app.get("/todos/", async (request, response) => {
  const { priority, status } = request.query;
  const todoQuery = `select
  * from todo
  where priority='${priority}' and status='${status}';`;
  const tableDetails = await db.all(todoQuery);
  //const { id, todo, status } = tableDetails;
  response.send(tableDetails);
});

//get 4

app.get("/todos/", async (request, response) => {
  const { search_q } = request.query;
  const todoQuery = `select
   * from todo
   where todo like '%${search_q}%';`;
  const tableDetails = await db.all(todoQuery);
  //const { id, todo, status } = tableDetails;
  response.send(tableDetails);
});

//method 2 -1
//const converttodobj = (dbObject) => {
// return {
//  id: dbObject.todoId,
//  todo: dbObject.todo,
//priority: dbObject.priority,
//status: dbObject.status,
//};
//};
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoQuery = `select
   * from todo
   where id='${todoId}';`;
  const tableDetails = await db.get(todoQuery);
  //const { id, todo, status } = tableDetails;

  //const { todoPriority, todoStatus } = tableDetails;
  response.send(tableDetails);
});

//method 3 post

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, status } = request.body;
  const todoQuery = `insert into todo(id,todo,priority,status)
  values('${id}',
    '${todo}',
    '${priority}',
    '${status}');`;
  await db.run(todoQuery);
  //const { id, todo, status } = tableDetails;

  //const { todoPriority, todoStatus } = tableDetails;
  response.send("Todo Successfully Added");
});

//put method -1
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  //const { status, priority, todo } = request.body;
  //response.send(status);
  switch (true) {
    case request.body === "status":
      response.send("Status Updated");
    case request.body === "priority":
      response.send("Priority Updated");
    case request.body === "todo":
      response.send("Todo updated");
  }
  //response.send(priority);
  //response.send(todo);
  //const todoQuery = `update todo
  //set

  //status='${status}'
  //where id='${todoId}';`;
  // await db.run(todoQuery);
  //const { id, todo, status } = tableDetails;

  //const { todoPriority, todoStatus } = tableDetails;
  //response.send(todo);
});

//put method -2

//delete method

app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const todoQuery = `delete
    from todo
   where id='${todoId}';`;
  await db.get(todoQuery);
  //const { id, todo, status } = tableDetails;

  //const { todoPriority, todoStatus } = tableDetails;
  response.send("Todo Deleted");
});

module.exports = app;
