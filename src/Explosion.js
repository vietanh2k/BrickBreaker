

var Explosion = cc.Sprite.extend({
    ctor:function (pos,res) {
        this._super(res);
        this.active = true;
        this.visible = true;
        this.x = pos.x;
        this.y = pos.y;

        this.play();
        return true;
    },
    play:function(){

        var delay = new cc.DelayTime(0.05);
        var delay2 = new cc.DelayTime(0.1);

        this.setScale(0.45);
        var seq = cc.sequence(delay);
        var seq2 = cc.sequence(delay2);
        this.runAction(cc.sequence(
            seq2,
            cc.callFunc(this.moveUp, this),seq2,cc.callFunc(this.moveDown, this),seq,cc.callFunc(this.destroy, this)
        ));

    },
    moveUp:function (){
        this.setScale(0.5);
    },

    moveDown:function (){
        this.setScale(0.45);
    },

    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});


Explosion.create = function (arg1, arg2) {
    var explosion = new Explosion(arg1, arg2);
    // this._gameLayer.addChild(explosion);
    MW.CONTAINER.EXPLOSIONS.push(explosion);
    return explosion;
};

