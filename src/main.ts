import { createSocket } from "dgram";
import { createInterface, clearLine, clearScreenDown } from "readline";
import dotenv from "dotenv";
dotenv.config();

const LISTEN_PORT = Number(process.env.LISTEN_PORT) || 3001;
const TARGET_PORT = Number(process.env.TARGET_PORT) || 3000;
const TARGET_HOST = process.env.TARGET_HOST || "localhost";

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
    console.log(`[${rinfo.address}:${rinfo.port}] ${msg}`);
    askForInput();
});
socket.bind(LISTEN_PORT);


function askForInput() {
    isWaitingForInput = true;
    rl.question(`to ${TARGET_HOST}:${TARGET_PORT}> `, (answer) => {
        isWaitingForInput = false;
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(`[${TARGET_HOST}:${TARGET_PORT}] ${answer}`);
        socket.send(answer, TARGET_PORT, TARGET_HOST, (err) => {
            if (err) {
                console.error(err);
            } else {
                askForInput();
            }

        });
    });
}
askForInput();