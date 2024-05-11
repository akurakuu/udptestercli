import { createSocket } from "dgram";
import { createInterface, clearLine, clearScreenDown } from "readline";
import dotenv from "dotenv";
dotenv.config();

const TARGET_PORT = Number(process.env.TARGET_PORT) || 3000;
const CLIENT_PORT = Number(process.env.CLIENT_PORT) || 3001;
const SERVER_ADDRESS = process.env.SERVER_ADDRESS || "localhost";

console.log(process.env.TARGET_PORT);

console.log("UDP client");

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});
let isWaitingForInput = false;

const socket = createSocket("udp4");

socket.on("message", (msg, rinfo) => {
    if (isWaitingForInput) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
    }
    console.log(`server: ${msg}`);
    askForInput();
});
socket.bind(CLIENT_PORT);


function askForInput() {
    isWaitingForInput = true;
    rl.question(`to ${SERVER_ADDRESS}:${TARGET_PORT}> `, (answer) => {
        isWaitingForInput = false;
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(`message: ${answer}`);
        socket.send(answer, TARGET_PORT, SERVER_ADDRESS, (err) => {
            if (err) {
                console.error(err);
            } else {
                askForInput();
            }

        });
    });
}
askForInput();