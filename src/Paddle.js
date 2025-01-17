

var Paddle = cc.Sprite.extend({
    speed:600,
    _GameLayer:null,
    _ball: null,
    zOrder:3000,
    appearPosition:cc.p(0, 11),
    active:true,
    autoPlay: false,
    checkLeft: false,
    checkRight: false,
    ctor:function (ball) {
        this._super(res.paddle_png);
        this.setScale(0.5);
        this.appearPosition=cc.p(winSize.width/2,PADDLE_H/2);
        this.tag = this.zOrder;
        this.x = this.appearPosition.x;
	    this.y = this.appearPosition.y;
	    this._ball = ball;


    },
    update:function (dt) {
        this.updateMove(dt);
    },
    updateMove:function(dt, ball)
    {
        if ((MW.KEYS[cc.KEY.s] || MW.KEYS[cc.KEY.down])) {
            this.autoPlay = true;
        }
        if ((MW.KEYS[cc.KEY.space] )) {
            this.autoPlay = false;
        }
        if ((MW.KEYS[cc.KEY.a] || MW.KEYS[cc.KEY.left]) && this.x >= PADDLE_W/3 && (!this.autoPlay || !this._ball.runState)) {
            this.x -= dt * this.speed;
        }
        if ((MW.KEYS[cc.KEY.d] || MW.KEYS[cc.KEY.right]) && this.x <= winSize.width-PADDLE_W/3  && (!this.autoPlay || !this._ball.runState)) {
            this.x += dt * this.speed;
        }
    },


    runAutoPlay:function(dt)
    {
        if(this.autoPlay && this._ball.y > 0 && this._ball.y < winSize.height ){
            if((this.x > this._ball.x+BALL_SIZE)&& this.x >= PADDLE_W/3 && this._ball.speed.x<0){
                this.x -= dt * this.speed;
                if(this.x <= this._ball.x+BALL_SIZE) {
                    this.x = this._ball.x+BALL_SIZE;
                }
            }
            else if((this.x < this._ball.x-BALL_SIZE)&& this.x <= winSize.width-PADDLE_W/3 && this._ball.speed.x>0){
                this.x += dt * this.speed;
                if(this.x >= this._ball.x-BALL_SIZE) {
                    this.x = this._ball.x-BALL_SIZE;
                }
            }
        }
    },

    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 2, w, h / 2);
    },

    paddleTouch:function (x, y) {
        var delay = new cc.DelayTime(0.5);
        var seq = cc.sequence(delay);
        this.runAction(cc.sequence(
            cc.callFunc(this.changeColor, this),seq,cc.callFunc(this.changeColor2, this)
        ));
    },
    changeColor:function (x, y) {
        this.setTexture('res/paddleX.png');
    },

    changeColor2:function (x, y) {
        this.setTexture('res/paddle2.png');
    },

});
