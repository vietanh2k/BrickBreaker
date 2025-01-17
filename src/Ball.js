

//bullet
var Ball = cc.Sprite.extend({
    _GameLayer: null,
    active:true,
    size: 15,
    HP:1,
    maxSpeedX: 600,
    maxSpeedY: 600,
    appearPosition2:cc.p(0,0),
    starSpeed:cc.p(500, 500),
    rootSpeed:cc.p(500, 500),
    speed:cc.p(0, 0),
    zOrder:3000,
    runState: false,
    nextLvl: false,
    ctor:function (game) {
        this._super(res.ball_png);
        this._GameLayer = game;
        this.setScale(0.05);

        this.appearPosition2=cc.p(winSize.width/2,BALL_SIZE/2+PADDLE_H+1);
        this.x = this.appearPosition2.x;
        this.y = this.appearPosition2.y;
    },
    update:function (dt) {
        this.checkGameStart();
        this.updateRun();
        if(this.runState){
            var x = this.x, y = this.y;
            this.x = x +dt*this.speed.x ;
            this.y = y + dt*this.speed.y ;

            if (x < BALL_SIZE/2) {
                this.x = BALL_SIZE/2 - this.speed.x*dt ;
                this.speed.x = -this.speed.x;
            }
            if (x > g_sharedGameLayer.screenRect.width-BALL_SIZE/2 ) {

                this.x = g_sharedGameLayer.screenRect.width-BALL_SIZE/2 - this.speed.x*dt ;
                this.speed.x = -this.speed.x;
            }
            if ( y > g_sharedGameLayer.screenRect.height-BALL_SIZE) {
                this.y = g_sharedGameLayer.screenRect.height-BALL_SIZE - this.speed.y*dt*2 ;
                this.speed.y = -this.speed.y;
            }
            this.detectCollisionPaddle(dt);
        }



    },

    checkGameStart: function (){
        if(!this.runState) {
            this.x = this._GameLayer._paddle.x;
            this.y = this._GameLayer._paddle.y + BALL_SIZE / 2 + PADDLE_H / 2 + 1;
            this.speed.x = 0;
            this.speed.y = 0;
        }
    },

    updateRun:function()
    {
        if ((MW.KEYS[cc.KEY.w] || MW.KEYS[cc.KEY.up])) {
            if(this.speed.x == 0 && this.speed.y == 0){
                this.runState = true;
                this.speed.x = this.starSpeed.x/2;
                this.speed.y = this.starSpeed.y;
            }

        }
    },
    destroy:function () {
        this.active = false;
        this.visible = false;
    },
    checkRunBug:function () {
        if(this.speed.y < this.maxSpeedY*0.15 && this.speed.y > -this.maxSpeedY*0.15){
            if(this.speed.x != 0 ){
                this.speed.y = this.maxSpeedY*0.15;
            }

        }
    },
    collideRect:function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    },

    detectCollisionPaddle:function (dt){
        var bottomBall = this.y- BALL_SIZE/2;
        var leftBall = this.x- BALL_SIZE/2;

        var topPaddle = this._GameLayer._paddle.y+PADDLE_H/2;
        var leftPaddle = this._GameLayer._paddle.x-PADDLE_W/2;
        var rightPaddle = this._GameLayer._paddle.x+PADDLE_W/2;

        var hitPos= 0;

        if(!this._GameLayer.checkL && bottomBall <= topPaddle){
            if(this.x > leftPaddle && this.x < rightPaddle){
                this._GameLayer._paddle.paddleTouch();
                if(MW.SCORE>0)  MW.SCORE -= 10;
                hitPos = this.x - leftPaddle;
                this.y = topPaddle+BALL_SIZE/2 - this.speed.y*dt;
                this.speed.y = - this.speed.y;
                switch (this.checkHitPosition(hitPos, PADDLE_W)){
                    case 0: {
                        this.speed.x = this.speed.x-this.maxSpeedX/3.5;
                        this.checkMaxSpeed();
                        cc.log('case0');
                        break;

                    };

                    case 1: {
                        var ran = Math.floor(Math.random() * 2)*2-1;
                        this.speed.x = this.speed.x+ran*this.maxSpeedX/10;
                        this.checkMaxSpeed();
                        cc.log('case1');
                        break;
                    };

                    case 2: {
                        this.speed.x = this.speed.x+this.maxSpeedX/3;
                        this.checkMaxSpeed();
                        cc.log('case2');
                        break;
                    };

                }
            }
            else{
                if(this._GameLayer.shieldActive){
                    this._GameLayer.shieldActive = false;
                    this._GameLayer.shieldTouch = true;
                    this.y = topPaddle+BALL_SIZE/2 - this.speed.y*dt;
                    this.speed.y = - this.speed.y;

                }else {
                    this._GameLayer.checkL = true;
                    if (MW.LIFE > 0) {
                        MW.LIFE--;
                        MW.SCORE -= 100;
                        if (MW.SCORE < 0) MW.SCORE = 0;
                    }
                }

            }
        }
    },

    checkMaxSpeed:function ( ){
        if(this.speed.x < -this.maxSpeedX){
            this.speed.x = -this.maxSpeedX;
        }
        if(this.speed.x > this.maxSpeedX){
            this.speed.x = this.maxSpeedX;
        }
        if(this.speed.y < -this.maxSpeedY){
            this.speed.y = -this.maxSpeedY;
        }
        if(this.speed.y > this.maxSpeedY){
            this.speed.y = this.maxSpeedY;
        }
        this.checkRunBug();

    },


    checkHitPosition:function (hitPosition, paddleSize){
        if(hitPosition < paddleSize/3){
            return 0;
        }
        else if(hitPosition > 2*paddleSize/3){
            return 2;
        }else{
            return 1;
        }

    },

    // shieldTouch:function (){
    //     var bar = new cc.Sprite('res/barTouch.png');
    //     bar.setScaleX(6);
    //     bar.setScaleY(0.8);
    //     bar.setPosition(250, 10);
    //         this.setTexture('res/bar.png');
    //     var delay = new cc.DelayTime(1.5);
    //     var delay2 = new cc.DelayTime(0.1);
    //     var delay3 = new cc.DelayTime(0.1);
    //     this.setTexture('res/barTouch.png');
    //     var seq = cc.sequence(delay);
    //     var seq2 = cc.sequence(delay2);
    //     var seq3 = cc.sequence(delay3);
    //     this.runAction(cc.sequence(seq3,
    //         cc.callFunc(this.changeIma, this),seq3,cc.callFunc(this.setDisappear, this)
    //     ));
    //
    // },
    // changeBar:function (){
    //     var bar = new cc.Sprite('res/barTouch.png');
    //     bar.setScaleX(6);
    //     bar.setScaleY(0.8);
    //     bar.setPosition(250, 10);
    //     this.setTexture('res/bar.png');
    //     var delay = new cc.DelayTime(1.5);
    //     var delay2 = new cc.DelayTime(0.1);
    //     var delay3 = new cc.DelayTime(0.1);
    //     this.setTexture('res/barTouch.png');
    //     var seq = cc.sequence(delay);
    //     var seq2 = cc.sequence(delay2);
    //     var seq3 = cc.sequence(delay3);
    //     this.runAction(cc.sequence(seq3,
    //         cc.callFunc(this.changeIma, this),seq3,cc.callFunc(this.setDisappear, this)
    //     ));
    //
    // }


});

Ball.getOrCreateBall = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
    /**/
    var selChild = null;
    if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
        for (var j = 0; j < MW.CONTAINER.PLAYER_BULLETS.length; j++) {
            selChild = MW.CONTAINER.PLAYER_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    }
    else {
        for (var j = 0; j < MW.CONTAINER.ENEMY_BULLETS.length; j++) {
            selChild = MW.CONTAINER.ENEMY_BULLETS[j];
            if (selChild.active == false) {
                selChild.visible = true;
                selChild.HP = 1;
                selChild.active = true;
                return selChild;
            }
        }
    }
    selChild = Ball.create(bulletSpeed, weaponType, attackMode, zOrder, mode);
    return selChild;
};

Ball.create = function (bulletSpeed, weaponType, attackMode, zOrder, mode) {
    var ball = new Ball(bulletSpeed, weaponType, attackMode);
    g_sharedGameLayer.addBullet(ball, zOrder, mode);
    if (mode == MW.UNIT_TAG.PLAYER_BULLET) {
        MW.CONTAINER.PLAYER_BULLETS.push(ball);
    } else {
        MW.CONTAINER.ENEMY_BULLETS.push(ball);
    }
    return ball;
};


