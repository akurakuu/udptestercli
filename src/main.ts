import { createSocket } from "dgram";
import { createInterface, clearLine, clearScreenDown } from "readline";

const CLIENT_PORT = 39393;
const SERVER_ADDRESS = "localhost";
const SERVER_PORT = 39392;

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
    rl.question(`to ${SERVER_ADDRESS}:${SERVER_PORT}> `, (answer) => {
        isWaitingForInput = false;
        process.stdout.moveCursor(0, -1);
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        console.log(`message: ${answer}`);
        socket.send(answer, SERVER_PORT, SERVER_ADDRESS, (err) => {
            if (err) {
                console.error(err);
            } else {
                askForInput();
            }

        });
    });
}
askForInput();