
var GameWin = cc.Layer.extend({
    _paddle:null,
    _lbScore:0,

    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        var back = new cc.Sprite(res.back2_png);
        // bac.setAnchorPoint(0,0);
        back.setScale(0.85);
        back.setPosition(480,280);
        this.addChild(back);

        var logo = new cc.Sprite(res.vic_png);
        logo.attr({
            anchorX: 0,
            anchorY: 0,
            x: 0,
            y: 300,
            scale: 1
        });
        this.addChild(logo,10,1);

        var logoBack = new cc.Sprite(res.hpin_png);
        logoBack.attr({
            anchorX: 0,
            anchorY: 0,
            x: 200,
            y: logo.y +75,
            scale: 0.22
        });
        this.addChild(logoBack, 9);

        var singalHeight = MW.menuHeight;
        var singalWidth = MW.menuWidth;

        var playAgainNormal = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 3, 0, singalWidth, singalHeight));
        var playAgainSelected = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 3, singalHeight, singalWidth, singalHeight));
        var playAgainDisabled = new cc.Sprite(res.menu_png, cc.rect(singalWidth * 3, singalHeight * 2, singalWidth, singalHeight));

        var flare = new cc.Sprite(res.flare_jpg);
        this.addChild(flare);
        flare.visible = false;
        var playAgain = new cc.MenuItemSprite(playAgainNormal, playAgainSelected, playAgainDisabled, function(){
            flareEffect(flare,this,this.onPlayAgain);
        }.bind(this) );
        playAgain.scale = MW.SCALE;

        var menu = new cc.Menu(playAgain);
        this.addChild(menu, 1, 2);
        menu.x = winSize.width / 2;
        menu.y = 270;

        var lbScore = new cc.LabelTTF("Your Score:"+MW.SCORE,"Arial Bold",26);
        lbScore.x = 240;
        lbScore.y = 340;
        lbScore.color = cc.color(255,0,0);
        this.addChild(lbScore,10);


        if(MW.SOUND){
            cc.audioEngine.playMusic(cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT ? res.mainMainMusic_wav : res.mainMainMusic_mp3, true);
        }

        return true;
    },
    onPlayAgain:function (pSender) {
        cc.audioEngine.stopMusic();
        cc.audioEngine.stopAllEffects();
        var scene = new cc.Scene();
        scene.addChild(new GameLayer());
        scene.addChild(new GameControlMenu());
        cc.director.runScene(new cc.TransitionFade(1.2,scene));
    }
});

GameWin.scene = function () {
    var scene = new cc.Scene();
    var layer = new GameWin();
    scene.addChild(layer);
    return scene;
};
