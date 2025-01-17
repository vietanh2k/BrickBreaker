

//bullet
var HP = cc.Sprite.extend({
    _GameLayer: null,
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
    checkGet: false,
    ctor:function (game) {
        this._super('res/hp.png');
        this._GameLayer = game;
        var ran = Math.random() * (winSize.width-BALL_SIZE*2) + BALL_SIZE;
        this.setScale(0.25);
        this.x = ran;
        this.y = winSize.height;
        this.checkGet= false;

        this.speed.y = -400;
    },

    update:function (dt) {
        if(!this.checkGet){
            this.updateMove(dt);
        }

        if ( this.y < 0) {
            this.destroy();
        }
        this.detectCollisionPaddle(dt);
    },

    updateMove:function (dt) {
        var x = this.x, y = this.y;
        this.x = x +dt*this.speed.x ;
        this.y = y + dt*this.speed.y ;
    },


    destroy:function () {
        this.active = false;
        this.visible = false;
        this.checkGet = false;
    },

    collideRect:function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    },

    detectCollisionPaddle:function (dt){
        var bottomBall = this.y- BALL_SIZE/2;
        var topPaddle = this._GameLayer._paddle.y+PADDLE_H/2;
        var leftPaddle = this._GameLayer._paddle.x-PADDLE_W/2;
        var rightPaddle = this._GameLayer._paddle.x+PADDLE_W/2;


        if(!this.checkOver && bottomBall <= topPaddle && !this.checkGet){
            if(this.x > leftPaddle && this.x < rightPaddle){
                MW.LIFE++;
                this.checkGet = true;
                this.getHP();
                this._GameLayer._paddle.paddleTouch();
                this.checkOver = true;
            }
            else{
                this.checkOver = true;
            }
        }
    },

    getHP:function (dt){
        // var delay = new cc.DelayTime(1.5);
        var delay2 = new cc.DelayTime(0.1);
        var delay3 = new cc.DelayTime(0.5);
        this.speed.y = 0;
        var seq2 = cc.sequence(delay2);
        var seq3 = cc.sequence(delay3);
        this.runAction(cc.sequence(
            cc.callFunc(this.changeIma, this),seq2,cc.callFunc(this.changeScale, this),seq3,cc.callFunc(this.destroy, this)
        ));
    },

    changeIma:function (dt){
        this.setTexture('res/heal.png');
        this.y = PADDLE_H+20 ;
        this.setScale(0.23);
        this.speed.y = 0;
    },
    changeScale:function (dt){
        this.setScale(0.28);
        this.y = this.y + 5;
    },





});

