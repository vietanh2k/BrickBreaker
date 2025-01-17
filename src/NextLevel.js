

var NextLevel = cc.Sprite.extend({
    ctor:function (pos,res) {
        this._super(res);
        this.active = true;
        this.visible = false;
        this.x = pos.x;
        this.y = pos.y;

        this.play();
        return true;
    },
    play:function(){
        var delay3 = new cc.DelayTime(0.7);
        var delay = new cc.DelayTime(1.3);
        var delay2 = new cc.DelayTime(0.1);

        this.setScale(0.45);
        var seq = cc.sequence(delay);
        var seq2 = cc.sequence(delay2);
        var seq3 = cc.sequence(delay3);
        this.runAction(cc.sequence(
            seq3,cc.callFunc(this.appear, this),
            seq2, cc.callFunc(this.moveUp, this),
            seq2,cc.callFunc(this.moveDown, this),
            seq,cc.callFunc(this.destroy, this)
        ));

    },
    moveUp:function (){
        this.setScale(0.5);
    },

    moveDown:function (){
        this.setScale(0.45);
    },
    appear:function (){
        this.visible = true;
    },

    destroy:function () {
        this.visible = false;
        this.active = false;
    }
});


NextLevel.create = function (arg1, arg2) {
    var nextlvl = new NextLevel(arg1, arg2);
    return nextlvl;
};

