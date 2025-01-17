
var LevelManager = cc.Class.extend({
    _level:null,
    _gameLayer:null,
    ctor:function(gameLayer){
        if(!gameLayer){
            throw "gameLayer must be non-nil";
        }
        this._level = Level1;
        this._gameLayer = gameLayer;
    },


    loadLevelResource:function(lvl){
        var levelInfor = this._level.enemies;
        var numRow = levelInfor[lvl].numRow;
        var numCol = levelInfor[lvl].numCol;
        var numType2 = levelInfor[lvl].numType2;
        var numType3 = levelInfor[lvl].numType3;
        var newSpeed = levelInfor[lvl].speed;
        this.loadBulletSpeed(newSpeed);

        var startX  = BRICK_W;
        var startY = winSize.height - BRICK_H*4;

        var disX = (winSize.width-BRICK_W*(numCol+1))/(numCol-1);
        var disY = (startY - winSize.height/2)/(numRow);
        for(var row = 0; row < numRow ; row++){
            for(var col = 0; col < numCol; col++){
                if(row<numRow-numType3-numType2){
                    this.addEnemyToGameLayer(1,cc.p(startX+col*(disX+BRICK_W),startY- row*disY ));
                }else if(row < numRow-numType3){
                    this.addEnemyToGameLayer(2,cc.p(startX+col*(disX+BRICK_W),startY- row*disY ));
                }else{
                    this.addEnemyToGameLayer(3,cc.p(startX+col*(disX+BRICK_W),startY- row*disY ));
                }

            }
        }

    },

    loadBulletSpeed:function (newSpeed){
        this._gameLayer._ball.starSpeed.x = newSpeed.x;
        this._gameLayer._ball.starSpeed.y = newSpeed.y;
        // this._gameLayer._ball.updateMaxSpeed();
    },

    addEnemyToGameLayer:function(type,p){
		var addEnemy = Brick.create(BrickType[type-1], this._gameLayer);
        addEnemy.x = p.x;
        addEnemy.y = p.y;
        this._gameLayer.addChild(addEnemy);


    },

});
