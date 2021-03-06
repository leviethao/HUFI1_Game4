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
import FoodLaucher from "./FoodLaucher";
import Circle from "./Circle";
import Util from "./Util";

@ccclass
export default class Food extends cc.Component {


    // LIFE-CYCLE CALLBACKS:
    direction: cc.Vec2;
    canvas: cc.Canvas;

    speed: number;
    location: cc.Vec2;

    gravity: number;
    target: cc.Node = null;
    gravityDistance: number;
    

    onLoad () {

    }

    init () {
        let gameSetting = this.canvas.node.getComponent(InGame).gameSetting.getComponent(GameSetting);
        this.speed = gameSetting.foodSpeed;

        this.canvas.node.getComponent(InGame).camera.getComponent(cc.Camera).addTarget(this.node);
        this.location = this.node.position;
        this.gravity = gameSetting.foodGravity;
        this.gravityDistance = gameSetting.foodGravityDistance;

        this.node.getComponent(cc.CircleCollider).radius = this.node.width / 2;
    }

    start () {

    }

    update (dt) {
        this.move(dt);
        this.checkOutOfCircle();
        this.checkTargetDistance();
        this.gravityEffect(dt);
    }

    reuse () {
        
    }

    unuse () {

    }

    move (dt: number) {
        //this.location.addSelf(this.direction.mul(this.speed * dt));

        this.location.x += this.direction.x * this.speed * dt;
        this.location.y += this.direction.y * this.speed * dt;

        this.node.position = this.location;
    }

    destroyFood () {
        this.canvas.getComponent(InGame).camera.getComponent(cc.Camera).removeTarget(this.node);
        let foodLaucher: FoodLaucher = this.canvas.node.getChildByName("FoodLaucher").getComponent(FoodLaucher);
        foodLaucher.foodPool.put(this.node);
    }

    checkOutOfCircle () {
        let circle = this.canvas.getComponent(InGame).circle;
        let circleRadius = circle.getComponent(Circle).radius;
        if (cc.pDistance(this.node.position, circle.position) > circleRadius - this.node.width / 2) {
            this.destroyFood();
        }
    }

    gravityEffect (dt: number) {
        if (!this.target) {
            return;
        }

        //let direction = this.target.position.add(this.node.position.mul(-1));
        let direction = new cc.Vec2(this.target.position.x - this.node.position.x, this.target.position.y - this.node.position.y);
        direction = Util.normalize(direction);

        //this.location.addSelf(direction.mul(this.gravity * dt));
        this.location.x += direction.x * this.gravity * dt;
        this.location.y += direction.y * this.gravity * dt;

        this.node.position = this.location;
    }

    checkTargetDistance () {
        let player = this.canvas.node.getComponent(InGame).player;
        if (cc.pDistance(player.position, this.node.position) < this.gravityDistance) {
            this.target = player;
        } else {
            this.target = null;
        }
    }
}
