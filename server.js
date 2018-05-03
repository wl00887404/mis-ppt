const fs = require("fs");
const path = require("path");
const http = require("http");
const Koa = require("koa");
const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");

let spa = fs.readFileSync("./src/index.html", "utf-8");
let groups = require("./src/data/groups.json");
let groupsPath = path.resolve(__dirname, "./src/data/groups.json");

let app = new Koa();
const router = new Router();
let httpServer = http.createServer(app.callback());

let io = require("socket.io")(httpServer);
io.on("connection", socket => {});

/*
 * 方法
 */
const save = groups => {
  fs.writeFile(groupsPath, JSON.stringify(groups), error => {
    if (error) {
      throw "寫檔的時候爆炸了";
    }
  });
};
const restartClient = () => {
  io.emit("forceUpdate", "");
};

/*
 * 路由
 */
router
  .get("/groups", async (ctx, next) => {
    ctx.body = groups;
  })
  .get("/groups/:index", async (ctx, next) => {
    ctx.body = groups[ctx.params.index - 1];
  })
  .post("/groups/:index", async (ctx, next) => {
    groups[ctx.params.index - 1] = Object.assign(
      groups[ctx.params.index - 1],
      ctx.request.body
    );
    save(groups);
    io.emit("modifyGroups", JSON.stringify(groups));
    ctx.body = {
      msg: "+7不要催我啦"
    };
  })
  .post("/commits/:index", async (ctx, next) => {
    let index = ctx.params.index - 1;
    let date = new Date();
    let hour = date.getHours();
    let min = date.getMinutes();
    if ((hour + "").length == 1) {
      hour = "0" + hour;
    }
    if ((min + "").length == 1) {
      min = "0" + min;
    }

    let commit = Object.assign(ctx.request.body, { when: `${hour}:${min}` });
    groups[index].commits.push(commit);

    save(groups);
    io.emit("addCommit", JSON.stringify({ index, commit }));
    ctx.body = {
      msg: "嗚嗚嗚我好想畢業"
    };
  })
  .get("/forceUpdate", async (ctx, next) => {
    io.emit("forceUpdate", "");
    ctx.body = {
      msg: "可是我code還沒寫完"
    };
  })
  .get("/broadcast/:msg", async (ctx, next) => {
    io.emit("broadcast", ctx.params.msg);
    ctx.body = {
      msg: "嗚嗚嗚"
    };
  });

/*
 * 中介
 */
app
  .use(require("koa-static")(__dirname + "/public"))
  .use(bodyParser({ jsonLimit: "50mb" }))
  .use(router.routes())
  .use(router.allowedMethods())
  .use(async (ctx, next) => {
    await next();
    let p = ctx.request.url.split("?")[0];
    if (
      p.match(
        /^(\/|\/slide\/\d+|\/list|\/modify\/\d+|\/forceUpdate|\/broadcast\/.+)$/
      )
    ) {
      ctx.body = spa;
    }
  });

httpServer.listen(process.env.PORT || 3000);
