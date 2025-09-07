const homeExitFields =      [1001, 1026, 1051, 1076]
const finishEntryPoints =   [1023, 1048, 1073, 1098]
const finishPoints =        [15,16,17,18,25,26,27,28,35,36,37,38,45,46,47,48]
const homeFields =          [11,12,13,14,21,22,23,24,31,32,33,34,41,42,43,44]
class Point {
    constructor(pointId){
        this.pointId = pointId
        this.prevPointId = null
        this.nextPointId = null
        this.isFinishPoint = false
        this.isFinishEntryPoint = false
        this.correspondingFinishPointId = null
        this.isHomeField = false
        this.isHomeExitField = false
        this.isSphereOn = false
        this.sphereColorOn = null
        this.color = null
        this._finishCreation(pointId)
    }
    _finishCreation(pointId){
        if (finishPoints.includes(pointId)){
            this.isFinishPoint = true
            this.prevPointId = null
            this.nextPointId = pointId + 1

            if (pointId < 20){
                this.color = "red"
            }else if(pointId < 30){
                this.color = "blue"
            }else if(pointId < 40){
                this.color = "yellow"
            }else if(pointId < 50){
                this.color = "green"
            }
        }
        if (finishEntryPoints.includes(pointId)){
            this.isFinishEntryPoint = true
            switch (pointId) {
                case 1023:
                    this.correspondingFinishPointId = 25
                    break;
                case 1048:
                    this.correspondingFinishPointId = 35
                    break;
                case 1073:
                    this.correspondingFinishPointId = 45
                    break;
                case 1098:
                    this.correspondingFinishPointId = 15
                    break;
            }
        }
        if (homeFields.includes(pointId)){
            this.nextPointId = null
            this.prevPointId = null
            this.isHomeField = true
            if (pointId < 20){
                this.color = "red"
            }else if(pointId < 30){
                this.color = "blue"
            }else if(pointId < 40){
                this.color = "yellow"
            }else if(pointId < 50){
                this.color = "green"
            }
        }
        if (homeExitFields.includes(pointId)){
            this.isHomeExitField = true
            if (pointId == 1001){
                this.color = "red"
            }else if(pointId == 1026){
                this.color = "blue"
            }else if(pointId == 1051){
                this.color = "yellow"
            }else if(pointId == 1076){
                this.color = "green"
            }
        }
        if (pointId == 1001) {
            this.prevPointId = 1100
            this.nextPointId = 1002
        }else{
            this.prevPointId = pointId - 1
            this.nextPointId = pointId + 1
        }
        if(pointId == 1100){
            this.prevPointId = 1099
            this.nextPointId = 1001
        }
        if (pointId == 18 || pointId == 28 || pointId == 38 || pointId == 48){
            this.nextPointId = null
        }
        if(homeFields.includes(pointId) ){
            this.nextPointId = null
            this.prevPointId = null
        }
    }
    isFree(){
        return !this.isSphereOn
    }
    placeSphere(color){
        this.isSphereOn = true
        this.sphereColorOn = color
    }
    removeSphere(){
        this.isSphereOn = false
        this.sphereColorOn = null
    }
    isPassable(){
        if((this.isHomeExitField && this.isSphereOn) || (this.isFinishPoint && this.isSphereOn)){
            return false
        }
        return true
    }
}
module.exports = { Point }