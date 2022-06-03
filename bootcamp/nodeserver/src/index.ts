import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import routes from "./routers";
// import {Request, Response} from "express";
// import {Routes} from "./routes";
// import {User} from "./entity/User";

const SERVER_PORT = 5000

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    // app.use('/', (req, res)=>{
    //     console.log('received request:', req.params, req.query)
    //     res.send('hi backend server :)')
    // })

    // register express routes from defined application routes
    // Routes.forEach(route => {
    //     (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
    //         const result = (new (route.controller as any))[route.action](req, res, next);
    //         if (result instanceof Promise) {
    //             result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    //
    //         } else if (result !== null && result !== undefined) {
    //             res.json(result);
    //         }
    //     });
    // });

    // setup express app here
    // ...

    app.use('/', routes)
    // start express server
    app.listen(SERVER_PORT);

    // insert new users for test
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Timber",
    //     lastName: "Saw",
    //     age: 27
    // }));
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Phantom",
    //     lastName: "Assassin",
    //     age: 24
    // }));

    console.log(`Express server has started on port ${SERVER_PORT}. Open http://localhost:${SERVER_PORT} to see results`);

}).catch(error => console.log(error));
