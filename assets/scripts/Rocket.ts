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
import RocketLaucher from "./RocketLaucher";
import Util from "./Util";

@ccclass
export default class Rocket extends cc.Component {

    canvas: cc.Canvas = null;

    location: cc.Vec2;
    target: cc.Node;
    speed: number;
    lifeTime: number;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    }

    init () {
        let gameSetting = this.canvas.node.getComponent(InGame).gameSetting.getComponent(GameSetting);
        this.speed = gameSetting.rocketSpeed;

        this.canvas.node.getComponent(InGame).camera.getComponent(cc.Camera).addTarget(this.node);
        this.node.getComponent(cc.BoxCollider).size = this.node.getContentSize();
        this.lifeTime = gameSetting.rocketLifeTime;
    }

    start () {
        
    }

    update (dt) {
        this.move(dt);

        this.lifeTime -= dt;
        if (this.lifeTime <= 0) {
            this.destroyRocket();
        }
    }

    move (dt: number) {
        //let direction = this.target.position.add(this.node.position.mul(-1));
        let direction = new cc.Vec2(this.target.x - this.node.x, this.target.y - this.node.y);
        direction = Util.normalize(direction);
        //this.location.addSelf(direction.mul(this.speed * dt));
        this.location.x += direction.x * this.speed * dt;
        this.location.y += direction.y * this.speed * dt;
        this.node.position = this.location;

        let angle = Math.atan2(direction.y, direction.x) * 180 / Math.PI;
        this.node.rotation = -angle;
    }

    destroyRocket () {
        this.canvas.node.getComponent(InGame).camera.getComponent(cc.Camera).removeTarget(this.node);
        let rocketLaucher: RocketLaucher = this.canvas.node.getChildByName("RocketLaucher").getComponent(RocketLaucher);
        rocketLaucher.rocketPool.put(this.node);
    }
}
