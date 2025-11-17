const skipPoints = [19,20,29,30,39,40]

const { Point } = require('./point')
class Field {
    constructor(){
        this.points = []
        for (let i = 11; i <= 48; i++) {
            if (skipPoints.includes(i)) continue; 
            this.points.push(new Point(i))
        }
        for (let i = 1001; i <= 1100; i++) {
            this.points.push(new Point(i))
        }
    }
    getPointById(id){
        return this.points.find(point => point.pointId === id);
    }
}
module.exports = { Field }
