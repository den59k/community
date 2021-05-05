"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fastify_1 = __importDefault(require("fastify"));
const app_1 = __importDefault(require("./src/app"));
const server = fastify_1.default();
//Добавляем всё наше приложение к fastify
server.register(app_1.default, { prefix: '/api' });
const port = process.env.PORT || 3001;
server.listen(port, function (err, address) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`server listening on ${address}`);
});
//# sourceMappingURL=index.js.map