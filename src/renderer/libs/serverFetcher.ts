import {ServerResponse} from "../interfaces/serverResponse";

export default async function serverFetcher(url: string): Promise<ServerResponse> {
    // const r = await fetch(url);
    // return await r.json();

    const response = servers.find(s => s.url === url);
    if (response === undefined) {
        return {
            name: url,
            abbreviation: "",
            online: false,
            description: "",
            url: url,
            players: 0,
            maxPlayers: 0,
            version: "",
        }
    }
    return response
}

const servers: ServerResponse[] = [{
    name: "Strafkolonie Online",
    abbreviation: "SKO",
    online: true,
    description: "Auf der Lore des ersten Teils der Gothic Trilogie basierender Online-Roleplay-Server, dessen Fokus auf der Interaktion zwischen den Spielern sowie das dadurch entstehende Roleplay richtet.\n" +
        "Ob Buddler, Bandit, Templer oder Erzbaron – hinter jedem Charakter, den du auf dem Server triffst, steckt ein anderer Spieler, welcher sich seine ganz eigene Story für seinen Charakter ausgedacht hat und somit die Geschichte der Strafkolonie von Khorninis mitgestaltet.\n" +
        "Umgeben von einer magischen Barriere, welche eine Flucht unmöglich macht, wird in der sowohl berüchtigten als auch gefürchteten Minenkolonie von den Gefangenen des gesamten Reiches Erz für den König gefördert, welcher damit Waffen für seine Armee im Krieg gegen die Orks herstellt.\n" +
        "\n" +
        "DU bist einer dieser Gefangenen!\n" +
        "\n" +
        "Verurteilt zur lebenslangen Arbeit in den Erzminen von Khorinis, findest du deinen Weg in die berühmte Strafkolonie.\n" +
        "Findest du dich mit deinem Schicksal ab und machst das Beste aus deiner misslichen Lage oder setzt du alles daran, einen Weg in die Freiheit zu finden?\n" +
        "Diese Entscheidung liegt nun in deiner Hand. Schreibe deine eigene Geschichte, als Verurteilter Gefangener.\n",
    url: "http://localhost:23000",
    players: 76,
    maxPlayers: 100,
    version: "1.7.0-reveares+1",
}, {
    name: "Classic Khorinis",
    abbreviation: "CK",
    online: true,
    description: "Klassisches Khorinis RP",
    url: "http://localhost:23001",
    players: 1,
    maxPlayers: 100,
    version: "1.7.0-reveares+1",
}, {
    name: "Jharkendar Online",
    abbreviation: "JKO",
    online: true,
    description: "Work in progress",
    url: "http://localhost:23002",
    players: 0,
    maxPlayers: 100,
    version: "1.7.0-reveares+1",
}, {
    name: "Gothic Online: Untold Chapters",
    abbreviation: "Gucci",
    online: true,
    description: "Gucci",
    url: "http://localhost:23003",
    players: 23,
    maxPlayers: 100,
    version: "1.7.0-reveares+1",
}, {
    name: "Eskalon Online",
    abbreviation: "eso",
    online: true,
    description: "Vulkaninselabenteuer",
    url: "http://localhost:23005",
    players: 40,
    maxPlayers: 100,
    version: "1.7.0-sabrosa+1",
},];