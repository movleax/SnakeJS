var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillRect(20, 20, 150, 100);

var gameLoopInterval = setInterval(GameCycle, simSpeed);

const snakeNodeSquare = new Vector2D(10, 10);

/* 
Snake:
	Has a head node
	Has body nodes
	This could be a linked list!
	
	Has a direction and magnitude (2D vector).
	Has a way to change its direction.
	Has a way to detect collision with it's body nodes
	
	Head node moves in the direction the snake is pointed in. 
	Snake cannot move opposite of the direction currently travelling.
	Head node passes down its old position to the node it points to. Iteratively, this happens for all nodes.
	
	If a Node collides with food, create a new node if next == null.
    If a Node collides with itself, game over. 
*/

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

    AddBodyNode()
    {
        if(this.node == null)
        {
            let bodyNode = new BodyNode(this.x, this.y, this.w, this.h, this.direction);

            // calculate the position vector behind *this body node
            let oppositeDirection = this.direction.RotateAroundOrigin(this.direction.GetDegrees()+180);
            let offsetVector = new Vector2D(oppositeDirection.x*snakeNodeSquare.x, oppositeDirection.y*snakeNodeSquare.y);
            let behindNodePosition = this.position.AddVector(offsetVector);

            bodyNode.position = behindNodePosition;

            this.node = bodyNode;
        }
        else
        {
            this.node.AddBodyNode();
        }
    }

    UpdatePosition(newPosition)
    {
        if(this.node != null)
        {
            this.node.UpdatePosition(this.position);
        }

        this.position = newPosition;
    }

    Draw(ctx)
    {
        ctx.fillStyle = "green";
        ctx.fillRect(this.position.x, this.position.y, snakeNodeSquare.x, snakeNodeSquare.y);
    }
}



class Snake
{
    constructor(x, y, w, h)
    {

        let head = new BodyNode(x, y, w, h, new Vector2D(1, 0));
        head.AddBodyNode();
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

    }
 
}

