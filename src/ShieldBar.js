

//bullet
var ShieldBar = cc.Sprite.extend({
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
    shieldTouch: true,
    ctor:function (game) {
        this._super('res/bar.png');
        this._GameLayer = game;
        this.setScaleX(6);
        this.setScaleY(0.8);
        this.setPosition(250, 10);
        this.shieldTouch = true;
    },

    update:function (dt) {
       // if(!this._GameLayer.shieldActive){
       //     this.destroy();
       // }
        if(this._GameLayer.shieldTouch){
            this.touchShield();
        }
    },


    destroy:function () {
        this.active = false;
        this.visible = false;
        this._GameLayer.shieldActive = false;
    },

    autoDestroy:function () {
        var delay = new cc.DelayTime(5);
        var seq = cc.sequence(delay);
        this.runAction(cc.sequence(
            seq,cc.callFunc(this.destroy, this)
        ));
    },

    collideRect:function (x, y) {
        return cc.rect(x - 3, y - 3, 6, 6);
    },
    touchShield:function (){
        this._GameLayer.shieldTouch = false;
        var delay = new cc.DelayTime(1.5);
        var delay2 = new cc.DelayTime(0.1);
        var delay3 = new cc.DelayTime(0.1);
        this.setTexture('res/barTouch.png');
        var seq = cc.sequence(delay);
        var seq2 = cc.sequence(delay2);
        var seq3 = cc.sequence(delay3);
        this.runAction(cc.sequence(seq3,
            cc.callFunc(this.changeIma, this),seq3,cc.callFunc(this.setDisappear, this)
        ));
    },

    changeIma:function (dt){
        this.setTexture('res/bar.png');
    },

    setDisappear:function (dt){
        this._GameLayer.shieldTouch = false;
    },






});


