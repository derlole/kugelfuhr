class State {
    constructor(n, stateText){
        this.nr = n
        this.state = 0
        this.text = stateText
        this.subText = ''
    }
    changeStateState(state){
        this.state = state
    }
    changeSubText(newSub){
        this.subText = newSub
    }
}

class FlowControl {
    constructor(){
        this.state1 = new State(1, 'Karte anwaehlen')
        this.state2 = new State(2, 'Karte ablegen')
        this.state3 = new State(3, 'Kugel auswaehlen')
        this.state4 = new State(4, 'Ziel auswaehlen')
        this.state5 = new State(5, 'Bestaetigen')
        this.states = [this.state1, this.state2, this.state3, this.state4, this.state5]
        this.state2.changeSubText('<button class="stepButton" onclick="layCardTrigger()">Karte ablegen</button><button class="stepButton" onclick="throwCardTrigger()">Karte abwerfen</button>')
        this.state5.changeSubText('<button class="stepButton" onclick="checkoutTurn()">Bestätigen</button>')
    }
}

module.exports = { FlowControl }
