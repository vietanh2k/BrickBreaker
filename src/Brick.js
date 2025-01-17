

var Brick = cc.Sprite.extend({
    _gamelayer:null,
    active:true,
    HP:1,
    scoreValue:200,
    zOrder:1000,
    ctor:function (arg, game) {
        var ran = Math.floor(Math.random() * 3);
        this._super('res/brick'+arg.HP+'.png');
        this.setScale(0.3);
        this._gamelayer = game;
        this.HP = arg.HP;
        this.scoreValue = arg.scoreValue;

    },
    update:function (dt) {
        this.detectCollisionBrick(dt);
        if (this.HP <= 0) {
            if(MW.ACTIVE_ENEMIES > 2){
                this.createShield();
            }

            this.destroy();
            var res = 'res/bo.png';
            var pos = new cc.p(this.x, this.y);
            var ex = Explosion.create(pos,res);
            this._gamelayer.addChild(ex);

        }

    },

    createShield:function () {
        if(!this._gamelayer.shieldDown && !this._gamelayer.shieldActive && !this._gamelayer.shieldGet){
            var rand = Math.floor(Math.random() * 1);
            if(rand <1){
                var shi = new Shield(this._gamelayer, this);

                this._gamelayer.addChild(shi, 1000, MW.UNIT_TAG.PLAYER);
                this._gamelayer.shieldDown = true;
            }
        }

    },

    detectCollisionBrick:function (dt){
        var ballX = this._gamelayer._ball.x;
        var ballY = this._gamelayer._ball.y;
        var ballSpeedX = this._gamelayer._ball.speed.x;
        var ballSpeedY = this._gamelayer._ball.speed.y;

        var bottomBall = ballY-BALL_SIZE/2;
        var leftBall = ballX-BALL_SIZE/2;
        var topBall = ballY+BALL_SIZE/2;
        var rightBall = ballX+BALL_SIZE/2;

        var topBrick = this.y+BRICK_H/2;
        var leftBrick = this.x-BRICK_W/2;
        var rightBrick = this.x+BRICK_W/2;
        var bottomBrick = this.y-BRICK_H/2;

        if( bottomBall <= topBrick && topBall >= bottomBrick  && leftBall <= rightBrick && rightBall >= leftBrick){
            this._gamelayer._ball.x = this._gamelayer._ball.x - ballSpeedX*dt;
            this._gamelayer._ball.y = this._gamelayer._ball.y - ballSpeedY*dt;
                if(
                    (ballSpeedX >= 0 && ballSpeedY > 0 && topBall-bottomBrick >= rightBall - leftBrick ) ||
                    (ballSpeedX <= 0 && ballSpeedY > 0 && topBall-bottomBrick >= rightBrick - leftBall) ||
                    (ballSpeedX >= 0 && ballSpeedY < 0 && topBrick-bottomBall >= rightBall - leftBrick) ||
                    (ballSpeedX <= 0 && ballSpeedY < 0 && topBrick-bottomBall >= rightBrick - leftBall)
                ){
                    this._gamelayer._ball.speed.x = -ballSpeedX ;
                    this.hurt();
                    return 1;
                }
                else
                    {
                        this._gamelayer._ball.speed.y = -ballSpeedY ;
                        this.hurt();
                        return 1;
                }

        }

    },
    destroy:function () {
        MW.SCORE += this.scoreValue;
        // if(!this._gamelayer.shieldDown && !this._gamelayer.shieldActive && !this._gamelayer.shieldGet){
        //     var rand = Math.floor(Math.random() * 3);
        //     if(rand <1 && MW.ACTIVE_ENEMIES > 1){
        //         this.createShield();
        //     }
        // }
        this.visible = false;
        this.active = false;



        MW.ACTIVE_ENEMIES--;
    },

    hurt:function () {

        if(this._gamelayer._ball.runState){
            this.HP--;
            if(this.HP > 0){
                this.setTexture('res/brick'+this.HP+'.png');
            }
        }


    },
    collideRect:function (x, y) {
        var w = this.width, h = this.height;
        return cc.rect(x - w / 2, y - h / 4, w, h / 2+20);
    }
});


Brick.create = function (arg, game) {
    var enemy = new Brick(arg,game);
    MW.CONTAINER.ENEMIES.push(enemy);
    MW.ACTIVE_ENEMIES++;
    return enemy;
};

