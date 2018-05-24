// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import GameSetting from "./GameSetting";
import Circle from "./Circle";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    gameSetting: cc.Node = null;
    
    @property(cc.Node)
    circle: cc.Node = null;

    @property(cc.Camera)
    camera: cc.Camera = null;

    @property(cc.Node)
    player: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    level: number;
    levelFactor: number;
    score: number;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();
    }

    init () {
        let setting = this.gameSetting.getComponent(GameSetting);
        this.level = 0;
        this.levelFactor = setting.levelFactor;
        this.score = 0;
        this.updateScoreLabel();
    }

    start () {

    }

    update (dt) {
        if (this.level < 0) {
            this.gameOver();
        }
    }

    levelUp () {
        this.level++;
        this.circle.getComponent(Circle).grownUp();
    }

    levelDown () {
        this.level--;
        this.circle.getComponent(Circle).shrinkBack();
    }

    updateScoreLabel () {
        this.scoreLabel.string = "Score: " + this.score;
    } 

    gainScore () {
        this.score++;
        this.updateScoreLabel();

        if (this.score % this.levelFactor == 0) {
            this.levelUp();
        }
    }

    
    gameOver () {
        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("GameOver");
        })));   
    }
}
