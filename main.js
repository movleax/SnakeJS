var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillRect(20, 20, 150, 100);

var gameLoopInterval = setInterval(GameCycle, simSpeed);

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
    }

    GetVector2D()
    {
        return new Vector2D(this.x, this.y);
    }

    UpdateVector(x, y)
    {
        this.x = x;
        this.y = y;
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
        ctx.fillText("Must Implement Must override iDrawable's Draw() method", 0, 0, 100);
    }
}








class BodyNodes
{
    constructor()
    {

    }
}



class Snake
{
    constructor()
    {

    }

 
}

