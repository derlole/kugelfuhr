class Sphere {
    constructor(color, sphereId){
        this.color = color
        this.sphereId = sphereId
        this.home = true
        this.finish = false
        this.position = 0
        this._initPos(color, sphereId)
    }
    _initPos(color, sphereId){
        if (color == "red"){
            this.position = 10 + sphereId
        }else if(color == "yellow"){
            this.position = 30 + sphereId
        }else if(color == "blue"){
            this.position = 20 + sphereId
        }else if(color == "green"){
            this.position = 40 + sphereId
        }
    }
}
module.exports = { Sphere }