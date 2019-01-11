var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillRect(20, 20, 150, 100);

var gameLoopInterval = setInterval(GameCycle, simSpeed);

const snakeNodeSquare = new Vector2D(10, 10);

class Vector2D
{
    constructor(x, y)
    {
        this.x = x == undefined ? 0 : x;
        this.y = y == undefined ? 0 : y;

        this.rads = Math.atan2(y, x);
    }

    GetVector2D()
    {
        return new Vector2D(this.x, this.y);
    }

    UpdateVector(x, y)
    {
        this.x = x;
        this.y = y;

        this.rads = Math.atan2(y, x);
    }

    AddVector(vector)
    {
        let newX = this.x + vector.x;
        let newY = this.y + vector.y;

        return new Vector2D(newX, newY);
    }

    GetDegrees()
    {
        return this.degrees;
    }

    RotateAroundOrigin(degrees)
    {
        let newRads = (degrees  * Math.PI / 180);

        // perform the rotation
        let rotatedX = Math.cos(newRads) * (this.x) - Math.sin(newRads) * (this.y);
        let rotatedY = Math.sin(newRads) * (this.x) + Math.cos(newRads) * (this.y);
    
        return new Vector2D(rotatedX, rotatedY);
    }

    RotateAroundPoint(point, degrees)
    {
        let newRads = (degrees  * Math.PI / 180);

        // perform the rotation
        let rotatedX = Math.cos(newRads) * (this.x - point.x) - Math.sin(newRads) * (this.y - point.y) + point.x;
        let rotatedY = Math.sin(newRads) * (this.x - point.x) + Math.cos(newRads) * (this.y - point.y) + point.y;
        
        return new Vector2D(rotatedX, rotatedY);
    }
}

class Rectangle
{
    constructor(x, y, w, h)
    {
        this.position = new Vector2D(x, y);
        this.w = w;
        this.h = h;
    }

    UpdateRectangle(x, y, w, h)
    {
        this.position.UpdateVector(x, y);
        this.w = w;
        this.w = h;
    }

    GetRectangle()
    {
        return new Rectangle(this.x, this.y, this.w, this.h);
    }

    GetPosition()
    {
        return this.position;
    }
}

class CollisionBox extends Rectangle
{
    constructor(x, y, w, h)
    {
        super(x, y, w, h);
        this.hasCollided = false;
    }
    
    UpdateCollisionBox(x, y, w, h)
    {
        this.UpdateRectangle(x, y, w, h);
    }

    CheckCollision(otherCollisionBox)
    {
        if( this.position.x + this.w >= otherCollisionBox.position.x && this.position.x <= otherCollisionBox.position.x + otherCollisionBox.w
         && this.position.y + this.y >= otherCollisionBox.position.y && this.position.y <= otherCollisionBox.position.y + otherCollisionBox.h)
        {
            this.hasCollided = true;
            return true;
        }

        this.hasCollided = false;
        return false;
    }
}

class iDrawable
{
    constructor()
    {
    }

    Draw(ctx)
    {
        ctx.font = "18px Arial";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, 100, 100);
        ctx.fillStyle = "black";
        ctx.fillText("Must override iDrawable's Draw() method", 0, 0, 100);
    }
}

class iMoveable
{
    constructor()
    {
        this.velocity;
    }
}

class BodyNode extends iDrawable
{
    constructor(x, y, w, h, direction)
    {
        this.cBox = new CollisionBox(x, y, w, h);
        this.position = new Vector2D(x, y);
        this.direction = direction;
        this.node = null;
    }

    AddBodyNode(newNode)
    {
        this.node = newNode;
    }

    SetPosition(newPosition)
    {
        this.position = newPosition;
    }

    GetPosition()
    {
        return this.position;
    }

    SetDirection(newDirection)
    {
        this.direction = newDirection;
    }

    GetDirection()
    {
        return this.direction;
    }

    Draw(ctx)
    {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y, snakeNodeSquare.x, snakeNodeSquare.y);
    }
}

const Directions = {
    Left: new Vector2D(-1, 0),
    Right: new Vector2D(1, 0),
    Up: new Vector2D(0, -1),
    Down: new Vector2D(0, 1)
};

class Snake
{
    constructor(x, y, w, h)
    {
        this.direction = new Vector2D(1, 0);
        this.velocity = new Vector2D(this.direction.x*snakeNodeSquare.x, this.direction.y*snakeNodeSquare.y); 
        this.position = new Vector2D(x, y);

        this.head = new BodyNode(x, y, w, h, direction);
        AddBodyNode();
    }

    ChangeDirection(newDirection)
    {
        this.direction = newDirection;
        this.velocity = new Vector2D(this.direction.x*snakeNodeSquare.x, this.direction.y*snakeNodeSquare.y);
    }

    AddBodyNode()
    {
        // find the last node in the Snake's body
        let lastNode = head;
        while(lastNode.node != null)
        {
            lastNode = lastNode.node;
        }

        // create the new body node
        let bodyNode = new BodyNode(lastNode.position.x, lastNode.position.y, snakeNodeSquare.x, snakeNodeSquare.h, lastNode.direction);

        // calculate the position vector behind lastNode
        let oppositeDirection = lastNode.direction.RotateAroundOrigin(lastNode.direction.GetDegrees()+180);
        let offsetVector = new Vector2D(oppositeDirection.x*snakeNodeSquare.x, oppositeDirection.y*snakeNodeSquare.y);
        let behindNodePosition = lastNode.position.AddVector(offsetVector);

        // Set the new body node to be behind the last node
        bodyNode.position = behindNodePosition;

        // set the last node to this newly created bodynode
        lastNode.node = bodyNode;
    }

    Draw(ctx)
    {
        let traverseNode = head;
        while(traverseNode != null)
        {
            traverseNode.Draw(ctx);
            traverseNode = traverseNode.node;
        }
    }

    Move()
    {
        // update the Snake class' position
        this.position = this.position.AddBodyNode(this.velocity);

        // these will be used to updated the snake's body node's positions
        let newPosition = this.position;
        let oldPosition;

        // these will be used to update the snake's body node's directions
        let newDirection = this.direction;
        let oldDirection;

        let traverseNode = head;
        while(traverseNode != null)
        {
            oldPosition = traverseNode.GetPosition();
            oldDirection = traverseNode.GetDirection();
            
            traverseNode.SetPosition(newPosition);
            traverseNode.SetDirection(newDirection);

            newPosition = oldPosition;
            newDirection = oldDirection;

            // traverse to next node
            traverseNode = traverseNode.node;
        }
    }
}

class Food
{
    constructor(x, y, w, h)
    {
        this.position = new Vector2D(x, y);
        this.cBox = new CollisionBox(x, y, w, h);
    }

    Draw(ctx)
    {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.position.x, this.position.y, snakeNodeSquare.x, snakeNodeSquare.y);
    }
}