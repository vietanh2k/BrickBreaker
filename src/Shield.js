

//bullet
var Shield = cc.Sprite.extend({
    _GameLayer: null,
    _brick: null,
    active:true,
    size: 15,
    HP:1,
    maxSpeedX: 600,
    maxSpeedY: 600,
    appearPosition2:cc.p(200,500),
    starSpeed:cc.p(500, 500),
    rootSpeed:cc.p(500, 500),
    speed:cc.p(0, -300),
    zOrder:3000,
    runState: false,
    nextLvl: false,
    checkOver: false,
    ctor:function (game, brick) {
        this._super('res/getShield.png');
        this._GameLayer = game;
        this._brick = brick;
        this.setScale(0.32);
        if(this._brick != null){
            this.x = this._brick.x;
            this.y = this._brick.y;
        }else{
            this.x = -50;
            this.y = -50;
        }

        this.speed.y = -200;
    },

    update:function (dt) {
            var x = this.x, y = this.y;
            this.x = x +dt*this.speed.x ;
            this.y = y + dt*this.speed.y ;

            if ( y < 0) {
               this.destroy();
            }
            this.detectCollisionPaddle(dt);
    },


    destroy:function () {
        this.active = false;
        this.visible = false;
    },

    collideRect:function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    },

    detectCollisionPaddle:function (dt){
        var bottomBall = this.y- BALL_SIZE/2;
        var topPaddle = this._GameLayer._paddle.y+PADDLE_H/2;
        var leftPaddle = this._GameLayer._paddle.x-PADDLE_W/2;
        var rightPaddle = this._GameLayer._paddle.x+PADDLE_W/2;


        if(!this.checkOver && bottomBall <= topPaddle){
            this._GameLayer.shieldDown = false;
            if(this.x > leftPaddle && this.x < rightPaddle){
                this._GameLayer.shieldGet = true;
                this.getShield();
                this._GameLayer._paddle.paddleTouch();
            }
            else{
                this.checkOver = true;
            }
        }
    },
    getShield:function (dt){
        var delay = new cc.DelayTime(1.5);
        var delay2 = new cc.DelayTime(0.1);
        var delay3 = new cc.DelayTime(0.5);
        this.speed.y = 0;
        var seq = cc.sequence(delay);
        var seq2 = cc.sequence(delay2);
        var seq3 = cc.sequence(delay3);
        this.runAction(cc.sequence(
            cc.callFunc(this.changeIma, this),seq2,cc.callFunc(this.changeScale, this),seq3,cc.callFunc(this.destroy, this)
        ));
    },

    changeIma:function (dt){
        this.setTexture('res/getS.png');
        this.y = PADDLE_H+20 ;
        this.setScale(0.35);
        this.speed.y = 0;
    },
    changeScale:function (dt){
        this.setScale(0.4);
        this.y = this.y + 5;
    },




});

