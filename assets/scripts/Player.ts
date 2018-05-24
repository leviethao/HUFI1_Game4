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
import Circle from "./Circle";
import Food from "./Food";
import Rocket from "./Rocket";

enum MoveDirection {
    None,
    Clockwise,
    CounterClockwise
}

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Canvas)
    canvas: cc.Canvas = null;

    //setting
    radius: number;
    moveSpeed: number;
    jumpSpeed: number;
    // LIFE-CYCLE CALLBACKS:

    drawing: cc.Graphics = null;
    color: cc.Color = null;
    location: cc.Vec2 = cc.Vec2.ZERO;
    isJumpActive: boolean;
    moveDirection: MoveDirection;
    angle: number;
    jumpSpeedCur: number;
    

    onLoad () {
        this.init();
        this.drawing = this.node.getComponent(cc.Graphics);
        this.color = cc.hexToColor("#1DE79F");

        cc.director.getCollisionManager().enabled = true;
        cc.director.getCollisionManager().enabledDebugDraw = true;

        this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStarted.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved.bind(this));
        this.canvas.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded.bind(this));
    }

    init () {
        let gameSetting: GameSetting = this.canvas.getComponent(InGame).gameSetting.getComponent(GameSetting);
        this.radius = gameSetting.playerRadius;
        this.node.getComponent(cc.CircleCollider).radius = this.radius;
        this.moveSpeed = gameSetting.playerMoveSpeed;
        this.isJumpActive = false;
        this.moveDirection = MoveDirection.None;
        this.angle = -90;
        this.jumpSpeed = gameSetting.playerJumpSpeed;
        this.jumpSpeedCur = this.jumpSpeed;
        
    }

    start () {
        this.location = this.node.position;
        this.draw();
    }

    update (dt) {
        this.gravityEffect(dt);
        this.checkCollidedWithCircle();
        this.moveClockwise(dt);
        this.moveCounterClockwise(dt);
        this.jump(dt);
    }

    draw () {
        this.drawing.clear();
        this.drawing.circle(0, 0, this.radius);
        this.drawing.strokeColor = this.color;
        this.drawing.fillColor = this.color;
        this.drawing.stroke();
        this.drawing.fill();
    }

    onCollisionEnter (other) {
        switch (other.tag) {
            case 1: {
                //food
                other.node.getComponent(Food).destroyFood();
                this.canvas.node.getComponent(InGame).gainScore();
            } break;
            case 2: {
                //rocket
                other.node.getComponent(Rocket).destroyRocket();
                this.canvas.node.getComponent(InGame).levelDown();
            } break;
        }
    }

    onTouchStarted (touch: cc.Event.EventTouch) {

    }

    onTouchMoved (touch: cc.Event.EventTouch) {
        let moveDistance = cc.pDistance(touch.getStartLocation(), touch.getLocation());
        if(Math.abs(moveDistance) > 10) {
            if (touch.getDeltaX() > 0) {

                this.moveDirection = MoveDirection.CounterClockwise;
            } else {
                this.moveDirection = MoveDirection.Clockwise;
            }
        }
    }

    onTouchEnded (touch: cc.Event.EventTouch) {
        if (this.moveDirection == MoveDirection.None && !this.isJumpActive) {
            this.isJumpActive = true;
            this.jumpSpeedCur = this.jumpSpeed;
        }

        this.moveDirection = MoveDirection.None;
    }

    gravityEffect (dt: number) {
        let gravity = this.canvas.getComponent(InGame).gameSetting.getComponent(GameSetting).gravity;
        this.location.addSelf(this.location.normalize().mul(gravity * dt));
        this.node.position = this.location;
    }

    checkCollidedWithCircle () {
        let circleRadius = this.canvas.node.getComponent(InGame).circle.getComponent(Circle).radius;
        if (circleRadius - this.location.mag() < this.radius) {
            //collided
            this.location = this.location.normalize().mul(circleRadius - this.radius);
            this.node.position = this.location;
        }
    }

    moveClockwise (dt: number) {
        if (this.moveDirection != MoveDirection.Clockwise) {
            return;
        }

        this.angle -= this.moveSpeed * dt * this.canvas.node.getComponent(InGame).circle.getComponent(Circle).getRatio();
        this.angle %= 360;
        this.rotate();
    }

    moveCounterClockwise (dt: number) {
        if (this.moveDirection != MoveDirection.CounterClockwise) {
            return;
        }

        this.angle += this.moveSpeed * dt * this.canvas.node.getComponent(InGame).circle.getComponent(Circle).getRatio();
        this.angle %= 360;
        this.rotate();
    }

    rotate () {
        let radian = this.angle * Math.PI / 180;
        let x = Math.cos(radian);
        let y = Math.sin(radian);

        this.location = new cc.Vec2(x, y).normalize().mul(this.location.mag());
        this.node.position = this.location;
    }

    jump (dt: number) {
        if (!this.isJumpActive) {
            return;
        }

        this.location.subSelf(this.location.normalize().mul(this.jumpSpeedCur * dt));
        this.node.position = this.location;

        let gravity = this.canvas.getComponent(InGame).gameSetting.getComponent(GameSetting).gravity;
        this.jumpSpeedCur -= gravity * dt;
        if (this.jumpSpeedCur <= 0) {
            this.isJumpActive = false;
        }
    }
}
