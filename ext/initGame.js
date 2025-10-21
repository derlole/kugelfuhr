const { Game } = require('../server/models/game');

class Nom{
    constructor(name, art, end){
        this.name = name;
        this.artikel = art;
        this.endung=end;
    }

    plural(){
        return this.name + this.endung;
    }
}

const noms = [
  new Nom("Aal", "der", "e"),
  new Nom("Anemone", "die", "n"),
  new Nom("Anglerfisch", "der", "e"),

  new Nom("Barrakuda", "der", "s"),
  new Nom("Blauwal", "der", "e"),

  new Nom("Clownfisch", "der", "e"),
  new Nom("Calmar", "der", "e"),

  new Nom("Delfin", "der", "e"),
  new Nom("Dugong", "der", "s"),

  new Nom("Einsiedlerkrebs", "der", "e"),
  new Nom("Eishai", "der", "e"),

  new Nom("Fächerfisch", "der", "e"),
  new Nom("Flunder", "die", "n"),
  new Nom("Fangschreckenkrebs", "der", "e"),

  new Nom("Garnele", "die", "n"),
  new Nom("Glasfisch", "der", "e"),

  new Nom("Hai", "der", "e"),
  new Nom("Hering", "der", "e"),
  new Nom("Hummer", "der", ""),

  new Nom("Igelrochen", "der", ""),

  new Nom("Jakobsmuschel", "die", "n"),

  new Nom("Krake", "der", "n"),
  new Nom("Kugelfisch", "der", "e"),
  new Nom("Koralle", "die", "n"),
  new Nom("Kofferfisch", "der", "e"),

  new Nom("Lachs", "der", "e"),
  new Nom("Languste", "die", "n"),

  new Nom("Manta", "der", "rochen"),
  new Nom("Makrele", "die", "n"),

  new Nom("Napoleonfisch", "der", "e"),
  new Nom("Nautilus", "der", "se"),

  new Nom("Oktopus", "der", "se"),
  new Nom("Orca", "der", "s"),

  new Nom("Pottwal", "der", "e"),
  new Nom("Plattfisch", "der", "e"),

  new Nom("Quappe", "die", "n"),
  new Nom("Qualle", "die", "n"),
  new Nom("Quastenflosser", "der", ""),

  new Nom("Rochen", "der", ""),
  new Nom("Riesenhai", "der", "e"),
  new Nom("Riffbarsch", "der", "e"),

  new Nom("Seestern", "der", "e"),
  new Nom("Sardine", "die", "n"),
  new Nom("Squid", "der", "s"),

  new Nom("Tintenfisch", "der", "e"),
  new Nom("Tarpun", "der", "e"),

  new Nom("Urzeitkrebs", "der", "e"),

  new Nom("Venusmuschel", "die", "n"),

  new Nom("Walhai", "der", "e"),
  new Nom("Wels", "der", "e"),

  new Nom("Yellowfin", "der", "s"),

  new Nom("Zackenbarsch", "der", "e"),
  new Nom("Zitteraal", "der", "e")
];

const adj = [
    ["abenteuerlich","achtsam","aktiv","athletisch","arschlangsam","ausdauernd"],
    ["behutsam","bezaubernd","beweglich","bunt","beissend"],
    ["charmant","clever","cool","chillig","cremig"],
    ["dynamisch","diskret","dreiradfahrend","diszipliniert","dankbar","dieseltrinkend"],
    ["ehrlich","eskalierend","ehemalig","energisch","erfahren","erfinderisch"],
    ["freundlich","flexibel","fantasievoll","friedlich","fleißig","farbenfroh"],
    ["geduldig","grobfahrlaessig","gelassen","genau","giftig","geistreich"],
    ["hilfsbereit","heiter","harmonisch","hampelnd","haesslich","hervorragend"],
    ["intelligent","intensiv","ideenreich","instinktiv","individuell","interessant"],
    ["jung","jubelnd", "jodelnd", "juristisch","japsend"],
    ["kreativ","kochend","kraftvoll","klebrig","klar","kurios"],
    ["liebenswert","lebendig","locker","langsam","lustig"],
    ["mutig","munter","matschig","mordlustig","motiviert"],
    ["neugierig","nett","neu","niedlich","nachhaltig","nussig"],
    ["offen","ordentlich","originell","optimistisch","opulent","objektiv"],
    ["peinlich","praktisch","positiv","planvoll"],
    ["quirlig","qualitativ","quaderförmig", "quakend"],
    ["ruhig","respektvoll","rein","robust","reichhaltig","raffiniert"],
    ["saftig","schnell","sensationell","sicher","sympathisch","spielerisch"],
    ["tanzend","tapfer","temperamentvoll","treu","tot","tolerant"],
    ["ungefaehrlich","unkompliziert","unschuldig","unterhaltsam","urban","ulkig"],
    ["verantwortungsbewusst","vielseitig","verloren"],
    ["wertvoll","wild","waschecht"],
    ["yummie"],
    ["zahm","zielstrebig","zart","zauberhaft","zeitlos"]
]

function capitalizeFirst(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function genName() {
    let nomen = noms[Math.floor(Math.random() * noms.length)];
    let firstLetter = nomen.name.charAt(0).toUpperCase();
    let pos = firstLetter.charCodeAt(0) - 65;
    if (pos > 24) {
        pos--;
    }
    let adjektiv = adj[pos][Math.floor(Math.random() * adj[pos].length)]
    return capitalizeFirst(adjektiv + "e") + " " + capitalizeFirst(nomen.plural());
}

function initDefaultGame(gameId, lifecycleId){
    let game = new Game(lifecycleId);
    //

    //
    game.name = genName()
    game = (global.games[gameId] = game)
    game.gameId = gameId
    game.currentPlayer = game.player1red
    game.startingPlayer = game.player1red
    game.givingPlayer = game.player4green
    game.deck.shuffle()
    game.player1red.deck.removeUnnecessaryDeckInformation()
    game.player2blue.deck.removeUnnecessaryDeckInformation()
    game.player3yellow.deck.removeUnnecessaryDeckInformation()
    game.player4green.deck.removeUnnecessaryDeckInformation()

    for (let i = 0; i < 5; i++) {
        game.player1red.drawCard(game.deck);
        game.player2blue.drawCard(game.deck);
        game.player3yellow.drawCard(game.deck);
        game.player4green.drawCard(game.deck);
    }
    return game
}
function initGlobals(){
    global.suits = {
        hearts: '♥',
        diamonds: '♦',
        clubs: '♣',
        spades: '♠'
    };
    global.homeExitFields =      [1001, 1026, 1051, 1076],
    global.finishEntryPoints =   [1023, 1048, 1073, 1098],
    global.finishPoints =        [15,16,17,18,25,26,27,28,35,36,37,38,45,46,47,48],
    global.homeFields =          [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
}
function initGameWithGameConfig(gameConfig, gameId){
    return;
}
function forcePlayableNoChecks(gameId){
    var game = global.games[gameId]
    game.round = 1
    game.player1red.changingState = 0
    game.player2blue.changingState = 0
    game.player3yellow.changingState = 0
    game.player4green.changingState = 0
    game.gameStatus = 5 // change state
    game.flowControl.state1.state = 1
}


module.exports = { initDefaultGame, initGlobals, initGameWithGameConfig, forcePlayableNoChecks };