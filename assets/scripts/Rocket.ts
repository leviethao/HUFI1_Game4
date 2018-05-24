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
export default class Rocket extends cc.Component {

    canvas: cc.Canvas = null;

    location: cc.Vec2;
    target: cc.Node;
    speed: number;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    init () {
        let gameSetting = this.canvas.node.getComponent(InGame).gameSetting.getComponent(GameSetting);
        this.speed = gameSetting.rocketSpeed;

        this.canvas.node.getComponent(InGame).camera.getComponent(cc.Camera).addTarget(this.node);
    }

    start () {
        
    }

    update (dt) {
        this.move(dt);
    }

    move (dt: number) {
        let direction = this.target.position.add(this.node.position.mul(-1));
        direction.normalizeSelf();
        this.location.addSelf(direction.mul(this.speed * dt));
        this.node.position = this.location;

        let angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
        this.node.rotation = -angle;
    }

    destroyRocket () {
        this.canvas.node.getComponent(InGame).camera.getComponent(cc.Camera).removeTarget(this.node);
    }
}