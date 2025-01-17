

STATE_PLAYING = 0;
STATE_GAMEOVER = 1;
MAX_CONTAINT_WIDTH = 40;
MAX_CONTAINT_HEIGHT = 40;
BRICK_W = 31*2;
BRICK_H = 8*2;
PADDLE_W = 58*2;
PADDLE_H = 11*2;
BALL_SIZE= 11*2;

var g_sharedGameLayer;

var GameLayer = cc.Layer.extend({
    _time:null,
    _paddle:null,
    _ball:null,
    _levelManager:null,
    _tmpScore:0,
    lbScore:null,
    screenRect:null,
    checkL: false,
    _lvl:0,
    maxLevel: 3,
    gameRun: true,
    nextIcon: true,
    checkNextLv: false,
    shieldDown: false,
    shieldActive: false,
    shieldGet: false,
    shieldTouch: false,
    _shieldBar: null,

    ctor:function(){
        this._super();
        this.init();
        this.gameRun = true;
        this.checkNextLv = false;
        this.shieldDown = false;
        this.shieldActive = false;
        this.shieldGet = false;
        this.shieldTouch = false;


    },
    init:function () {
        cc.spriteFrameCache.addSpriteFrames(res.textureOpaquePack_plist);
        cc.spriteFrameCache.addSpriteFrames(res.b01_plist);

        // reset global values
        MW.CONTAINER.ENEMIES = [];
        MW.CONTAINER.ENEMY_BULLETS = [];
        MW.CONTAINER.PLAYER_BULLETS = [];
        MW.CONTAINER.EXPLOSIONS = [];
        MW.CONTAINER.SPARKS = [];
        MW.CONTAINER.HITS = [];
        MW.CONTAINER.BACKSKYS = [];
        MW.CONTAINER.BACKTILEMAPS = [];
        MW.ACTIVE_ENEMIES = 0;
        MW.SCORE = 0;
        MW.LIFE = 2;
        this._state = STATE_PLAYING;

        this.initBackground();


        winSize = cc.director.getWinSize();
        this._levelManager = new LevelManager(this);

        this.screenRect = cc.rect(0, 0, winSize.width, winSize.height + 10);

        // // score
        this.lbScore = new cc.LabelBMFont("Score: "+MW.SCORE, res.arial_14_fnt);
        this.lbScore.attr({
            anchorX: 1,
            anchorY: 0,
            x: winSize.width - 5,
            y: winSize.height - 30,
            scale: MW.SCALE
        });
        this.lbScore.textAlign = cc.TEXT_ALIGNMENT_RIGHT;
        this.addChild(this.lbScore, 1000);


        // ship life
        var life = new cc.Sprite(res.ball_png);
        life.attr({
            scale: 0.05,
            x: 30,
            y: MW.HEIGHT - 27
        });
        this.addChild(life, 1, 5);

        // ship Life count
        this._lbLife = new cc.LabelTTF("0", "Arial", 20);
        this._lbLife.x = 60;
        this._lbLife.y = MW.HEIGHT - 29;
        this._lbLife.color = cc.color(255, 0, 0);
        this.addChild(this._lbLife, 1000);
        //
        // ball
        this._ball = new Ball(this);
        this.addChild(this._ball, this._ball.zOrder, MW.UNIT_TAG.PLAYER);
        // paddle
        this._paddle = new Paddle(this._ball);
        this.addChild(this._paddle, this._paddle.zOrder, MW.UNIT_TAG.PLAYER);

        g_sharedGameLayer = this;

        //
        this.addTouchListener();
        this.addKeyboardListener();
        //
        // // schedule
        this.scheduleUpdate();

        this._levelManager.loadLevelResource(this._lvl);
        // this._shieldBar = new ShieldBar(this);
        // cc.log(this);
        this.schedule( this.checkGameOver , 1);
        this.schedule( this.checkGameWin , 1.5);
        this.schedule( this.createHP , 10);
        this.schedule( this.checkLoseHP , 1.5);
        return true;
    },
    addTouchListener:function(){
        //Add code here
    },
    addKeyboardListener:function(){
            //Add code here

            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: function (key, event) {
                    MW.KEYS[key] = true;
                    // cc.log(key);
                },
                onKeyReleased: function (key, event) {
                    MW.KEYS[key] = false;
                }
            }, this);

    },
    // ///load enemy
    loadNewLvl:function () {
        this._time++;
        this._lvl ++;
        if(this._lvl > this.maxLevel-1 ){
            this.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(this.onGameWin, this)

            ));
            cc.log('win===========');
        }else{
            this._levelManager.loadLevelResource(this._lvl);
        }


    },

    update:function (dt) {
        var children = this.children;
        for (i in children) {
            selChild = children[i];
            if (selChild && selChild.active)
                selChild.update(dt);
        }
        this.updateUI(dt);
        this._paddle.runAutoPlay(dt);
        if(!this.checkNextLv) {
            this.checkNextLevel();
        }
        this.checkGetShield();

    },

    checkLoseHP: function (){

        if(this.checkL && MW.LIFE >0){
            this.gameRun = false;
            this.setResetBall();
        }
    },

    createHP: function (){


            if(this._ball.runState){
                var heal = new HP(this);
                this.addChild(heal, 1000, MW.UNIT_TAG.PLAYER);
            }


    },

    checkGetShield: function (){

        if(this.shieldGet){
            this.shieldTouch = true;
            var bar = new ShieldBar(this);
            bar.autoDestroy();
            this.addChild(bar);
            this.shieldGet = false;
            this.shieldActive = true;
        }
    },

    // runAuto: function (){
    //     this._paddle.runAutoPlay( this._ball)
    // },

    setResetBall: function (){

        this._paddle.runAction(cc.moveTo(0.2,this._paddle.appearPosition));
        this._ball.speed = cc.p(0,0);
        // this._bullet.runAction(cc.moveTo(1,this._ship.appearPosition));
        this._ball.runState = false;
        this.checkL = false;
        this.gameRun = false;

    },

    setNextlvlBall: function (){
        this._ball.speed = cc.p(0,0);
        this.checkL = false;
        this._ball.runState = false;
    },

    checkGameOver: function (){
        if(MW.LIFE <= 0)
        {
            this.runAction(cc.sequence(
                cc.delayTime(0.5),
                cc.callFunc(this.onGameOver, this)
            ));
        }
    },

    checkNextLevel: function (){
        if(MW.ACTIVE_ENEMIES <= 0 ){
            if(this._lvl <this.maxLevel-1){
                var shi = new Shield(this);
                this.addChild(shi, this._ball.zOrder, MW.UNIT_TAG.PLAYER);
                this.checkNextLv = true;
                var delay1 = new cc.DelayTime(0.6);
                var delay2 = new cc.DelayTime(2.2);
                var seq1 = cc.sequence(delay1);
                var seq2 = cc.sequence(delay2);
                this.runAction(cc.sequence(
                    seq1,
                    cc.callFunc(this.showNextLvl, this),
                    seq2,cc.callFunc(this.setNextLevel, this)
                ));
            }

        }
    },
    setNextLevel: function (){

                this.setNextlvlBall();
                this.loadNewLvl();
                this.nextIcon = true;
                this.checkNextLv = false;
                // cc.log('tess');
    },
    checkGameWin: function (){
        if(MW.ACTIVE_ENEMIES <= 0 && this._lvl >=this.maxLevel-1){
            this.loadNewLvl();
        }
    },

    showNextLvl: function (){
        if(MW.ACTIVE_ENEMIES <= 0 && this._lvl < this.maxLevel-1 && this.nextIcon){
            var res = 'res/lvl.png';
            var pos = new cc.p(winSize.width/2, winSize.height*2/3);
            var ex = NextLevel.create(pos,res);
            // ex.play();
            this.addChild(ex);
            this.nextIcon = false;
        }
    },



    updateUI:function () {
        if (this._tmpScore < MW.SCORE) {
            this._tmpScore += 10;
        }
        if (this._tmpScore > MW.SCORE) {
            this._tmpScore -= 10;
        }
        this._lbLife.setString(MW.LIFE + '');
        this.lbScore.setString("Score: " + this._tmpScore );
    },
    // collide:function (a, b) {
	//     var ax = a.x, ay = a.y, bx = b.x, by = b.y;
    //     if (Math.abs(ax - bx) > MAX_CONTAINT_WIDTH || Math.abs(ay - by) > MAX_CONTAINT_HEIGHT)
    //         return false;
    //
    //     var aRect = a.collideRect(ax, ay);
    //     var bRect = b.collideRect(bx, by);
    //     return cc.rectIntersectsRect(aRect, bRect);
    // },
    initBackground:function () {
        var back = new cc.Sprite(res.back2_png);
        back.setScale(0.85);
        back.setPosition(480,280);
        this.addChild(back);
    },

    onGameOver:function () {

        var children = this.children;
        for (i in children) {
            selChild = children[i];
            selChild.active = false;
        }
        var scene = new cc.Scene();
        scene.addChild(new GameOver());
	    cc.director.runScene(new cc.TransitionFade(0.5, scene));

    },
    onGameWin:function () {
        var children = this.children;
        for (i in children) {
            selChild = children[i];
            selChild.active = false;
        }
        var scene = new cc.Scene();
        scene.addChild(new GameWin());
        cc.director.runScene(new cc.TransitionFade(0.5, scene));
    }
});

GameLayer.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameLayer();
    scene.addChild(layer, 1);
    return scene;
};

