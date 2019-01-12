'use strict';

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = '#162802';
ctx.fillRect(0,0,canvas.width, canvas.height);

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
        return this.rads * 180 / Math.PI;
    }

    RotateAroundOrigin(degrees)
    {
        this.rads = (degrees  * Math.PI / 180);

        // perform the rotation
        let rotatedX = Math.round(Math.cos(this.rads) * (this.x) - Math.sin(this.rads) * (this.y));
        let rotatedY = Math.round(Math.sin(this.rads) * (this.x) + Math.cos(this.rads) * (this.y));
    
        return new Vector2D(rotatedX, rotatedY);
    }

    RotateAroundPoint(point, degrees)
    {
        this.rads = (degrees  * Math.PI / 180);

        // perform the rotation
        let rotatedX = Math.cos(this.rads) * (this.x - point.x) - Math.sin(this.rads) * (this.y - point.y) + point.x;
        let rotatedY = Math.sin(this.rads) * (this.x - point.x) + Math.cos(this.rads) * (this.y - point.y) + point.y;
        
        return new Vector2D(rotatedX, rotatedY);
    }
} const snakeNodeSquare = new Vector2D(10, 10);

class Rectangle
{
    constructor(x, y, w, h)
    {
        this.position = new Vector2D(x, y);
        this.w = w;
        this.h = h;
    }

    UpdateRectangle(x, y)
    {
        this.position.UpdateVector(x, y);
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
    
    UpdateCollisionBoxPosition(x, y)
    {
        this.UpdateRectangle(x, y);
    }

    CheckCollision(otherCollisionBox)
    {
        if( this.position.x + this.w > otherCollisionBox.position.x && this.position.x < otherCollisionBox.position.x + otherCollisionBox.w
         && this.position.y + this.h > otherCollisionBox.position.y && this.position.y < otherCollisionBox.position.y + otherCollisionBox.h)
        {
            this.hasCollided = true;
            return true;
        }

        this.hasCollided = false;
        return false;
    }
}

class BodyNode
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
        this.cBox.UpdateCollisionBoxPosition(this.position.x, this.position.y);
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

    CheckCollision(otherCollisionBox)
    {
        return this.cBox.CheckCollision(otherCollisionBox);
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

        this.head = new BodyNode(x, y, w, h, this.direction);
        this.AddBodyNode();
        this.AddBodyNode();
    }

    ChangeDirection(newDirection)
    {
        this.direction = newDirection;
        this.velocity = new Vector2D(this.direction.x*snakeNodeSquare.x, this.direction.y*snakeNodeSquare.y);
    }

    AddBodyNode()
    {
        // find the last node in the Snake's body
        let lastNode = this.head;
        while(lastNode.node != null)
        {
            lastNode = lastNode.node;
        }

        // create the new body node
        let bodyNode = new BodyNode(lastNode.position.x, lastNode.position.y, snakeNodeSquare.x, snakeNodeSquare.y, lastNode.direction);

        // calculate the position vector behind lastNode
        let oppositeDirection = lastNode.direction.GetVector2D();
        oppositeDirection = oppositeDirection.RotateAroundOrigin(lastNode.direction.GetDegrees()+180);
        let offsetVector = new Vector2D(oppositeDirection.x*snakeNodeSquare.x, oppositeDirection.y*snakeNodeSquare.y);
        let behindNodePosition = lastNode.position.AddVector(offsetVector);

        // Set the new body node to be behind the last node
        bodyNode.position = behindNodePosition;

        // set the last node to this newly created bodynode
        lastNode.node = bodyNode;
    }

    Draw(ctx)
    {
        let traverseNode = this.head;
        while(traverseNode != null)
        {
            traverseNode.Draw(ctx);
            traverseNode = traverseNode.node;
        }
    }

    Move()
    {
        // update the Snake class' position
        this.position = this.position.AddVector(this.velocity);

        // these will be used to updated the snake's body node's positions
        let newPosition = this.position;
        let oldPosition;

        // these will be used to update the snake's body node's directions
        let newDirection = this.direction;
        let oldDirection;

        let traverseNode = this.head;
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

    GetCboxArray()
    {
        let cBoxes = [];
        let traverseNode = this.head;
        while(traverseNode != null)
        {
            cBoxes.push(traverseNode.cBox);
            traverseNode = traverseNode.node;
        }

        return cBoxes;
    }

    CheckCollisionWithSelf()
    {
        let cBoxes = this.GetCboxArray();

        for(let i=0; i < cBoxes.length; i++)
        {
            for(let k=0; k < cBoxes.length; k++)
            {
                if(cBoxes[i] == cBoxes[k])
                {
                    continue;
                }

                if(cBoxes[i].CheckCollision(cBoxes[k]))
                {
                    return true;
                }
            }
        }

        return false;
    }

    CheckCollision(otherCollisionBox)
    {
        let cBoxes = this.GetCboxArray();

        for(let i=0; i < cBoxes.length; i++)
        {
            if(cBoxes[i].CheckCollision(otherCollisionBox))
            {
                return true;
            }
        }

        return false;
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

class Command
{
    constructor()
    {

    }

    Execute()
    {
        throw "Command.Execute() must be implemented";
    }
}

class KeyBoardCommand extends Command
{
    constructor(key)
    {
        super();
        this.key = key;
    }

    GetKey()
    {
        return this.key;
    }
}
	
class KeyBoardLeftCommand extends KeyBoardCommand
{
    constructor(snake)
    {
        super("ArrowLeft");
        this.snake = snake;
    }

    Execute()
    {
        this.snake.ChangeDirection(Directions.Left);
    }
}

class KeyBoardRightCommand extends KeyBoardCommand
{
    constructor(snake)
    {
        super("ArrowRight");
        this.snake = snake;
    }

    Execute()
    {
        this.snake.ChangeDirection(Directions.Right);
    }
}

class KeyBoardUpCommand extends KeyBoardCommand
{
    constructor(snake)
    {
        super("ArrowUp");
        this.snake = snake;
    }

    Execute()
    {
        this.snake.ChangeDirection(Directions.Up);
    }
}

class KeyBoardDownCommand extends KeyBoardCommand
{
    constructor(snake)
    {
        super("ArrowDown");
        this.snake = snake;
    }

    Execute()
    {
        this.snake.ChangeDirection(Directions.Down);
    }
}

class KeyBoard
{
    constructor()
    {
        this.commands = [];
    }

    AddKeyBoardCommand(newKeyBoardCommand)
    {
        this.commands.push(newKeyBoardCommand);
    }

    SetKeyBoardListener()
    {
        window.addEventListener("keydown", (event) => { this.CallBack_HandleInput(event) }, true);
    }

    CallBack_HandleInput(event)
    {
        if (event.defaultPrevented) 
        {
            return; // Do nothing if the event was already processed
        }
        
        for(let i=0; i < this.commands.length; i++)
        {
            if(this.commands[i].GetKey() == event.key)
            {
                this.commands[i].Execute();
                break;
            }
        }
        
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
    }

    UnSetKeyBoardListener()
    {
        window.removeEventListener("keydown", CallBack_HandleInput);
    }
}

class GameState
{
    constructor()
    {
        this.gameObjects = [];
        this.keyBoard;

        this.Init();
    }

    Init()
    {
        throw "GameState.Init() must be implemented"
    }

    GetGameObjects()
    {
        return this.gameObjects;
    }

    GetKeyBoard()
    {
        return this.keyBoard;
    }

    AddKeyBoard(newKeyBoard)
    {
        this.keyBoard = newKeyBoard;
    }

    AddGameObject(obj)
    {
        this.gameObjects.push(obj);
    }
}

class MainGame extends GameState
{
    constructor()
    {
        super();
    }

    Init()
    {
        var snake = new Snake(100, 100, 10, 10);

        var keyboard = new KeyBoard();
        keyboard.AddKeyBoardCommand(new KeyBoardDownCommand(snake));
        keyboard.AddKeyBoardCommand(new KeyBoardUpCommand(snake));
        keyboard.AddKeyBoardCommand(new KeyBoardLeftCommand(snake));
        keyboard.AddKeyBoardCommand(new KeyBoardRightCommand(snake));

        this.AddKeyBoard(keyboard);

        this.AddGameObject(snake);
    }
}

   
class Game
{
    constructor()
    {
        this.gameObjects = [];
        this.keyBoard;
    }

    LoadGameState(gameState)
    {
        if(this.keyBoard != null)
        {
            this.keyBoard.UnSetKeyBoardListener();
        }

        this.gameObjects = gameState.GetGameObjects();
        this.keyBoard = gameState.GetKeyBoard();

        this.keyBoard.SetKeyBoardListener();
    }

    Draw()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        // draw background
        ctx.fillStyle = '#162802';
        ctx.fillRect(0,0,canvas.width, canvas.height);

        for(let i=0; i < this.gameObjects.length; i++)
        {
            // look for draw function before calling it
            if(this.gameObjects[i].Draw != null)
            {
                this.gameObjects[i].Draw(ctx);
            }
        }
    }

    Logic()
    {
        this.Move();
        this.CheckCollisions();
    }

    Move()
    {
        for(let i=0; i < this.gameObjects.length; i++)
        {
            // look for draw function before calling it
            if(this.gameObjects[i].Move != null)
            {
                this.gameObjects[i].Move();
            }
        }
    }

    CheckCollisions()
    {
        for(let i=0; i < this.gameObjects.length; i++)
        {
            // check snake collision with itself
            if(this.gameObjects[i] instanceof Snake)
            {
                if(this.gameObjects[i].CheckCollisionWithSelf())
                {
                    alert("Ran into body! Game Over");
                }
            }

            // check all other objects
            for(let k=0; k < this.gameObjects.length; k++)
            {
                if(this.gameObjects[i] == this.gameObjects[k])
                {
                    continue;
                }

                if(this.gameObjects[i].CheckCollision(this.gameObjects[k]))
                {
                    if(this.gameObjects[i] instanceof BodyNode && this.gameObjects[k] instanceof BodyNode)
                    {
                        
                    }
                }
            }
        }
    }

    Cycle()
    {
        // input is already handled as a window event listener. See this.keyBoard.SetKeyBoardListener()

        this.Logic();

        this.Draw();
    }
}

var game = new Game();
var mainGame = new MainGame();
game.LoadGameState(mainGame);
var gameLoopInterval = setInterval(() => {game.Cycle()}, 250);
