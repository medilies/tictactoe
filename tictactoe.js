/**
 * @property **boardContainer** refrenced via the constructor
 * @property **nameInputField** used by other classes
 * @property **partyIdInputField** used by other classes
 * @property **startMenu** form - REQUIRES submit event handler: to call initParty procedure
 * @property **joinBtn** - REQUIRES click event handler: to call joinParty procedure
 * @property **localScoreElement**
 * @property **xoGridBoard** - REQUIRES click event handler: to locate which gamesquare was targeted
 * @property **opponentScoreElement**
 *
 */
class UI {
    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    constructor(boardContainer) {
        this.boardContainer = boardContainer;
        this.gameSquaresIdPrfix = "xo-gamesquare-";

        this.drawStartMenu();
    }

    //**********************************************
    // START MENU
    //**********************************************
    drawStartMenu() {
        this.boardContainer.innerHTML = "";

        const startMenu = document.createElement("div");

        this.appendStartPartyMenu(startMenu);
        this.appendJoinPartyMenu(startMenu);

        this.boardContainer.appendChild(startMenu);
    }

    appendStartPartyMenu(parent) {
        const startPartyMenu = document.createElement("div");

        this.appentNameInputField(startPartyMenu);
        this.appendCreatePartyBtn(startPartyMenu);

        parent.appendChild(startPartyMenu);
    }

    appendJoinPartyMenu(parent) {
        const joinPartyMenu = document.createElement("div");

        this.appendPartyIdInputField(joinPartyMenu);
        this.appendJoinPartyBtn(joinPartyMenu);

        parent.appendChild(joinPartyMenu);
    }

    appentNameInputField(parent) {
        this.nameInputField = document.createElement("input");
        this.nameInputField.type = "text";
        parent.appendChild(this.nameInputField);
    }

    appendCreatePartyBtn(parent) {
        this.startBtn = document.createElement("button");
        this.startBtn.innerText = "Create a party";
        parent.appendChild(this.startBtn);
    }

    appendPartyIdInputField(parent) {
        this.partyIdInputField = document.createElement("input");
        this.partyIdInputField.type = "text";
        parent.appendChild(this.partyIdInputField);
    }

    appendJoinPartyBtn(parent) {
        this.joinBtn = document.createElement("button");
        this.joinBtn.innerText = "Join a party";
        parent.appendChild(this.joinBtn);
    }

    //**********************************************
    // PARTY SCREEN
    //**********************************************
    drawPartyScreen(userName, Localsymbol, partyId = undefined) {
        this.boardContainer.innerHTML = "";

        this.appendlocalPlayerCard(userName, Localsymbol);
        this.appendXOGridBoard();
        this.appendEmptyOpponentArea();

        if (partyId !== undefined) this.displayPartyCodeForOwner(partyId);
    }

    appendXOGridBoard() {
        this.xoGridBoard = document.createElement("div");
        this.xoGridBoard.style.display = "grid";
        this.xoGridBoard.style.gap = "0.2rem";
        this.xoGridBoard.style.gridTemplateRows = "repeat(3, 100px)";
        this.xoGridBoard.style.gridTemplateColumns = "repeat(3, 100px)";
        this.xoGridBoard.style.background = "#ccc";
        this.xoGridBoard.style.width = "fit-content";
        this.xoGridBoard.style.width = "max-content";

        for (let i = 0; i < 9; i++) {
            const div = document.createElement("div");
            div.id = "xo-gamesquare-" + i;
            div.setAttribute("xo-gamesquare", "");
            div.style.background = "#fff";
            this.xoGridBoard.appendChild(div);
        }

        this.boardContainer.appendChild(this.xoGridBoard);
    }

    appendlocalPlayerCard(userName, Localsymbol) {
        this.localScoreElement = document.createElement("p");
        const localPlayerCard = this.createPlayerCard(
            userName,
            Localsymbol,
            this.localScoreElement
        );

        this.boardContainer.appendChild(localPlayerCard);
    }

    appendEmptyOpponentArea() {
        this.opponentElement = document.createElement("div");
        this.boardContainer.appendChild(this.opponentElement);
    }

    displayOpponentPlayerCrad(opponentName, opponentSymbol) {
        this.opponentScoreElement = document.createElement("p");
        const remotePlayerCard = this.createPlayerCard(
            opponentName,
            opponentSymbol,
            this.opponentScoreElement
        );

        this.opponentElement.innerHTML = "";
        this.opponentElement.appendChild(remotePlayerCard);
    }

    createPlayerCard(userName, symbol, scoreElement) {
        const playerCard = document.createElement("div");

        const playerName = document.createElement("p");
        playerName.innerText = userName;
        playerCard.appendChild(playerName);

        const playerSymbol = document.createElement("p");
        playerSymbol.innerText = symbol;
        playerCard.appendChild(playerSymbol);

        scoreElement.innerText = "Score: 0";
        playerCard.appendChild(scoreElement);

        return playerCard;
    }

    displayPartyCodeForOwner(partyID) {
        const inv = document.createElement("p");
        inv.innerText = "Share the party code with one friend: " + partyID;
        this.opponentElement.appendChild(inv);
    }

    drawSymbol(target, symbol) {
        const targetElement = document.querySelector(
            "#" + this.gameSquaresIdPrfix + target
        );
        targetElement.innerText = symbol;
    }
}

/**
 * @property localRoundSymbol "X" | "O"
 * @property remoteRoundSymbol "X" | "O"
 * @property gameState
 * @property turnState "locked" | "unlocked"
 */
class Round {
    constructor(localRoundSymbol, remoteRoundSymbol) {
        this.localRoundSymbol = localRoundSymbol;
        this.remoteRoundSymbol = remoteRoundSymbol;
    }

    initRoundState() {
        this.gameState = ["", "", "", "", "", "", "", "", ""];
    }

    updateRoundState(target, symbole) {
        this.gameState[target] = symbole;
        this.checkRoundWinner();
    }

    checkRoundWinner() {
        const g = this.gameState;
        // horizontal
        if (g[0] === g[1] && g[0] === g[2]) {
            if (g[0] === this.localRoundSymbol) this.win();
            else if (g[0] === this.remoteRoundSymbol) this.lose();
        } else if (g[3] === g[4] && g[3] === g[5]) {
            if (g[3] === this.localRoundSymbol) this.win();
            else if (g[3] === this.remoteRoundSymbol) this.lose();
        } else if (g[6] === g[7] && g[6] === g[8]) {
            if (g[6] === this.localRoundSymbol) this.win();
            else if (g[6] === this.remoteRoundSymbol) this.lose();
        }
        // vertical
        else if (g[0] === g[3] && g[0] === g[6]) {
            if (g[0] === this.localRoundSymbol) this.win();
            else if (g[0] === this.remoteRoundSymbol) this.lose();
        } else if (g[1] === g[4] && g[1] === g[7]) {
            if (g[1] === this.localRoundSymbol) this.win();
            else if (g[1] === this.remoteRoundSymbol) this.lose();
        } else if (g[2] === g[5] && g[2] === g[8]) {
            if (g[2] === this.localRoundSymbol) this.win();
            else if (g[2] === this.remoteRoundSymbol) this.lose();
        }
        // Diagonal
        else if (g[0] === g[4] && g[0] === g[8]) {
            if (g[0] === this.localRoundSymbol) this.win();
            else if (g[0] === this.remoteRoundSymbol) this.lose();
        } else if (g[2] === g[4] && g[2] === g[6]) {
            if (g[2] === this.localRoundSymbol) this.win();
            else if (g[2] === this.remoteRoundSymbol) this.lose();
        }
        // TIE
        else if (!g.includes("")) {
            console.log("tie");
        }
    }

    win() {
        this.lockTurn();
        this.initRoundState();
        console.log("win");
    }

    lose() {
        this.lockTurn();
        this.initRoundState();
        console.log("die");
    }

    lockTurn() {
        this.turnState = "locked";
    }

    unlockTurn() {
        this.turnState = "unlocked";
    }
}

/**
 * @property mqttConnection
 * @property userName REQUIRED for topic
 * @property partyId REQUIRED for topic
 * @property partySubTopic
 * @property partyPubTopic
 * @property {bool} hiSent
 * @property {bool} subscribed
 * @property {bool} mqttLogs
 */
class MQTT {
    constructor(userName, partyId) {
        this.mqttLogs = true;
        this.userName = userName;
        this.partyId = partyId;
        this.connect();
        this.setPartySubTopic();
        this.setPartyPubTopic();
        this.mqttCallbacks();
    }

    connect() {
        this.mqttConnection = mqtt.connect({
            protocol: "ws",
            host: "127.0.0.1",
            port: 8080,
            username: this.userName,
            clientId: this.userName,
            // path: "/mqtt",
        });
    }

    setPartySubTopic() {
        this.partySubTopic = JSON.parse(
            `{"tictactoe/${this.partyId}/#": {"qos":2}}`
        );
    }

    setPartyPubTopic() {
        this.partyPubTopic = `tictactoe/${this.partyId}/${this.userName}`;
    }

    mqttCallbacks() {
        // connection and subscribtion
        this.mqttConnection.on("connect", () => {
            this.mqttConnection.subscribe(this.partySubTopic, (err, grant) => {
                if (this.mqttLogs) {
                    if (err) throw ("SUBSCRIBE ERROR:", err);
                    this.subscribed = true;
                    console.log("SUBSCRIBED TO :", grant);
                }
            });
        });

        // Sent massages
        // this.mqttConnection.on("packetsend", (packet) => {
        //     // log
        //     if (this.mqttLogs) console.log("sent:    ", packet);
        // });
    }

    pubXO(squareNb) {
        const qos = { qos: 2 };
        this.mqttConnection.publish(this.partyPubTopic, squareNb, qos);
    }

    pubHi() {
        if (this.hiSent) return;
        // if this client is a joiner make sure it subscribed to party topic and can hear the echo of his "hi" to set this.hiSent to true to avoid more than (2)*hi in handshake
        // pubHI will only get delayed if subscribtion isn't confirmed
        if (!this.subscribed)
            setTimeout(() => {
                this.pubHi();
            }, 500);
        else {
            const qos = { qos: 2 };
            this.mqttConnection.publish(this.partyPubTopic, "hi", qos);
        }
    }
}

class Game {
    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    constructor(boardContainer) {
        this.boardContainer = boardContainer;
        this.ui = new UI(boardContainer);
        this.uiAttachStartMenuEventHandler();
    }

    uiAttachStartMenuEventHandler() {
        this.ui.startBtn.addEventListener("click", (e) => {
            this.initParty();
        });
        this.ui.joinBtn.addEventListener("click", () => {
            this.joinParty();
        });
    }

    uiAttachXOGridBoardEventHandler() {
        this.ui.xoGridBoard.addEventListener("click", (e) => {
            if (
                this.opponentUserName !== "unknown*" &&
                e.target.hasAttribute("xo-gamesquare") &&
                this.round.turnState === "unlocked"
            ) {
                this.round.lockTurn();
                this.mqtt.pubXO(e.target.id[14]);
            }
        });
    }

    /**
     *
     * @param {HTMLDivElement} boardContainer
     */
    initParty() {
        this.setUserName();
        this.setPartyIdOnInit();
        this.setSymbols("X", "O");
        this.setOpponentUserName("unknown*");
        this.round = new Round(this.localSymbol, this.remoteSymbol);
        this.round.unlockTurn();
        this.round.initRoundState();
        this.mqtt = new MQTT(this.userName, this.partyId);
        this.mqttOnMsgEventHandler(this.mqtt.mqttConnection);
        this.ui.drawPartyScreen(this.userName, this.localSymbol, this.partyId);
        this.uiAttachXOGridBoardEventHandler();
    }

    joinParty() {
        this.setUserName();
        this.setPartyIdOnJoin();
        this.setSymbols("O", "X");
        this.setOpponentUserName("unknown*");
        this.round = new Round(this.localSymbol, this.remoteSymbol);
        this.round.lockTurn();
        this.round.initRoundState();
        this.mqtt = new MQTT(this.userName, this.partyId);
        this.mqttOnMsgEventHandler(this.mqtt.mqttConnection);
        this.mqtt.pubHi();
        this.ui.drawPartyScreen(this.userName, this.localSymbol, undefined);
        this.uiAttachXOGridBoardEventHandler();
    }

    setUserName() {
        this.userName = this.ui.nameInputField.value;
    }

    setPartyIdOnInit() {
        this.partyId = this.userName + Date.now();
    }

    setPartyIdOnJoin() {
        this.partyId = this.ui.partyIdInputField.value;
    }

    setSymbols(local, remote) {
        this.localSymbol = local;
        this.remoteSymbol = remote;
    }

    setOpponentUserName(opponentUserName) {
        this.opponentUserName = opponentUserName;
    }

    /**
     * Uses the 3 following calsses
     *
     * - UI
     * - Round
     * - MQTT
     * @param {*} mqttConnection
     */
    mqttOnMsgEventHandler(mqttConnection) {
        mqttConnection.on("message", (topic, message) => {
            const msg = message.toString();
            const sender = topic.split("/")[2];

            // log
            if (this.mqtt.mqttLogs) console.log(topic, "<<>>", msg);

            // - XO exchanges:

            // - - User's play
            if (sender === this.userName && !isNaN(msg)) {
                this.ui.drawSymbol(msg, this.localSymbol);
                this.round.updateRoundState(msg, this.localSymbol);
            }
            // - - Opponent's play
            else if (
                this.opponentUserName !== "unknown*" &&
                sender === this.opponentUserName &&
                !isNaN(msg)
            ) {
                this.ui.drawSymbol(msg, this.remoteSymbol);
                this.round.updateRoundState(msg, this.remoteSymbol);
                this.round.unlockTurn();
            }

            // - Handshake
            else if (
                msg === "hi" &&
                sender === this.userName &&
                !this.mqtt.hiSent
            ) {
                this.mqtt.hiSent = true;
            } else if (
                this.opponentUserName === "unknown*" &&
                msg === "hi" &&
                sender
            ) {
                this.setOpponentUserName(sender);
                this.ui.displayOpponentPlayerCrad(
                    this.opponentUserName,
                    this.remoteSymbol
                );
                this.mqtt.pubHi();
            }
        });
    }
}

const board = document.querySelector("#xo-container");

const game = new Game(board);
