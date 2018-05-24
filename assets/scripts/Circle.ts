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
import InGame from "./InGame";
import GameSetting from "./GameSetting";
@ccclass
export default class Circle extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    //setting
    radius: number = 0;
    drawing: cc.Graphics = null;
    color: cc.Color = null;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init();

        //draw circle
        this.drawing = this.node.getComponent(cc.Graphics);
        this.color = cc.hexToColor("#C3C1F1");
    }

    init () {
        this.radius = this.canvas.getComponent(InGame).gameSetting.getComponent(GameSetting).circleRadius;
    }

    start () {
        this.draw();
    }

    // update (dt) {}

    draw () {
        this.drawing.clear();
        //drawing.moveTo(0, 0);
        this.drawing.circle(0, 0, this.radius);
        this.drawing.strokeColor = this.color;
        this.drawing.fillColor = this.color;
        this.drawing.fill();
        this.drawing.stroke();
    }
}
