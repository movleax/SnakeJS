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
        let newRads = (degrees  * Math.PI / 180);

        // perform the rotation
        let rotatedX = Math.round(Math.cos(newRads) * (this.x) - Math.sin(newRads) * (this.y));
        let rotatedY = Math.round(Math.sin(newRads) * (this.x) + Math.cos(newRads) * (this.y));
    
        return new Vector2D(rotatedX, rotatedY);
    }

    Scale(scale)
    {
        return new Vector2D(scale*this.x, scale*this.y);
    }

    RotateAroundPoint(point, degrees)
    {
        newRads = (degrees  * Math.PI / 180);

        // perform the rotation
        let rotatedX = Math.cos(newRads) * (this.x - point.x) - Math.sin(newRads) * (this.y - point.y) + point.x;
        let rotatedY = Math.sin(newRads) * (this.x - point.x) + Math.cos(newRads) * (this.y - point.y) + point.y;
        
        return new Vector2D(rotatedX, rotatedY);
    }

    Equals(otherVector)
    {
        return this.x == otherVector.x && this.y == otherVector.y;
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

class GameOverText
{
    constructor()
    {
        this.display = false;
    }

    Draw(ctx)
    {
        if(this.display)
        {
            ctx.font = "50px Arial";
            ctx.strokeStyle = "white";
            ctx.textAlign = "center"; 
            ctx.strokeText("Game Over", canvas.width/2, canvas.height/2);
        }
    }

    SetGameOver(isShown)
    {
        this.display = isShown;
    }
}

class TitleText
{
    constructor()
    {

    }

    Draw(ctx)
    {
        ctx.font = "50px Arial";
        ctx.strokeStyle = "white";
        ctx.textAlign = "center"; 
        ctx.strokeText("Snake JS", canvas.width/2, canvas.height/4);
    }
}

class StartText
{
    constructor()
    {

    }

    Draw(ctx)
    {
        ctx.font = "40px Arial";
        ctx.strokeStyle = "white";
        ctx.textAlign = "center"; 
        ctx.strokeText("Press Space to Start", canvas.width/2, canvas.height - canvas.height/2);
    }
}

class ScoreText
{
    constructor()
    {
        this.score = 0;
    }

    IncrememntScore()
    {
        this.score++;
    }

    Draw(ctx)
    {
        ctx.font = "18px Arial";
        ctx.strokeStyle = "white";
        ctx.textAlign = "center"; 
        ctx.strokeText("Score: " + this.score, canvas.width/2, canvas.height/16);
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
        this.isDead = false;

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
        oppositeDirection = oppositeDirection.Scale(-1);
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

    SetIsDead(isDead)
    {
        this.isDead = isDead;
    }

    Move()
    {
        if(this.isDead)
        {
            return;
        }

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

    SetPosition(newPosition)
    {
        this.position = newPosition;
        this.cBox.UpdateCollisionBoxPosition(this.position.x, this.position.y);
    }

    Draw(ctx)
    {
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.position.x, this.position.y, snakeNodeSquare.x, snakeNodeSquare.y);
    }

    CheckCollision(otherCollisionBox)
    {
        return this.cBox.CheckCollision(otherCollisionBox);
    }
}

class FoodController
{
    constructor()
    {
        this.foodPellet;
    }

    CheckCollision(otherCollisionBox)
    {
        if(this.foodPellet == null)
        {
            return false;
        }

        return this.foodPellet.CheckCollision(otherCollisionBox);
    }

    SpawnFood(snake)
    {
        if(this.foodPellet == null)
        {
            this.foodPellet = new Food(0, 0, snakeNodeSquare.x, snakeNodeSquare.y);
        }

        let newX = Math.round((Math.random() * (canvas.width - this.foodPellet.cBox.w))/10)*10;
        let newY = Math.round((Math.random() * (canvas.height - this.foodPellet.cBox.h))/10)*10;
        let newPosition = new Vector2D(newX, newY);

        this.foodPellet.SetPosition(newPosition);

        while(snake.CheckCollision(this.foodPellet.cBox))
        {
            newX = Math.round((Math.random() * canvas.width)) - this.foodPellet.cBox.w;
            newY = Math.round((Math.random() * canvas.height)) - this.foodPellet.cBox.h;
            newPosition = new Vector2D(newX, newY);
            this.foodPellet.SetPosition(newPosition);
        }
    }

    Draw(ctx)
    {
        this.foodPellet.Draw(ctx);
    }

    GetCboxArray()
    {
        return [this.foodPellet.cBox];
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
        // Do not change direction if it would be the opposite of where we are headed
        if(this.snake.direction.Equals(Directions.Right))
        {
            return;
        }

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
        // Do not change direction if it would be the opposite of where we are headed
        if(this.snake.direction.Equals(Directions.Left))
        {
            return;
        }

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
        // Do not change direction if it would be the opposite of where we are headed
        if(this.snake.direction.Equals(Directions.Down))
        {
            return;
        }

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
        // Do not change direction if it would be the opposite of where we are headed
        if(this.snake.direction.Equals(Directions.Up))
        {
            return;
        }

        this.snake.ChangeDirection(Directions.Down);
    }
}

class KeyBoardSpaceCommand extends KeyBoardCommand
{
    constructor(GameState)
    {
        super("Space");
        this.gameState = GameState;
    }

    Execute()
    {
        this.gameState.ChangeState(new MainGame());
    }
}

class KeyBoard
{
    constructor()
    {
        this.commands = [];
        this.callBackPtr = this.CallBack_HandleInput.bind(this);
    }

    AddKeyBoardCommand(newKeyBoardCommand)
    {
        this.commands.push(newKeyBoardCommand);
    }

    SetKeyBoardListener()
    {
        window.addEventListener("keydown", this.callBackPtr);
    }

    CallBack_HandleInput(event)
    {
        if (event.defaultPrevented) 
        {
            return; // Do nothing if the event was already processed
        }
        
        for(let i=0; i < this.commands.length; i++)
        {
            if(this.commands[i].GetKey() == event.code)
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
        window.removeEventListener("keydown", this.callBackPtr);
    }
}

class iGame
{
    constructor()
    {

    }

    Draw()
    {
        throw "Draw() must be implemented";
    }

    Logic()
    {
        throw "Logic() must be implemented";
    }

    Move()
    {
        throw "Move() must be implemented";
    }

    CheckCollisions()
    {
        throw "CheckCollisions() must be implemented";
    }

    Cycle()
    {
        throw "Cycle() must be implemented";
    }

    CheckStateChange(gameProxy)
    {
        throw "CheckStateChange(gameProxy) must be implemented";
    }
}

class Game extends iGame
{
    constructor()
    {
        super();
        this.gameState;
        this.gameProxy = new GameProxy(this);
    }

    LoadGameState(gameState)
    {
        if(gameState == null)
        {
            return;
        }

        // disable current state keyboard
        if(this.gameState != null && this.gameState.GetKeyBoard() != null)
        {
            this.gameState.keyBoard.UnSetKeyBoardListener();
        }

        // assign to this.gameState
        this.gameState = gameState;

        // set this.gameState keyboard as active
        this.gameState.keyBoard.SetKeyBoardListener();
    }

    Draw()
    {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.gameState.Draw(ctx);
    }

    Logic()
    {
        this.Move();
        this.CheckCollisions();
        this.gameState.CheckStateChange(this.gameProxy);
    }

    Move()
    {
        this.gameState.Move();
    }

    CheckCollisions()
    {
        this.gameState.CheckCollisions();
    }

    Cycle()
    {
        // input is already handled as a window event listener. See this.keyBoard.SetKeyBoardListener()

        this.Logic();

        this.Draw();
    }
    
}

class GameProxy
{
    constructor(game)
    {
        this.game = game;
    }

    LoadGameState(gameState)
    {
        this.game.LoadGameState(gameState);
    }
}

class GameState extends iGame
{
    constructor()
    {
        super();

        this.gameObjects = [];
        this.keyBoard;
        this.stateHasChanged = false;
        this.currentState;
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

    ChangeState(newState)
    {
        this.stateHasChanged = true;
        this.currentState = newState;
    }

    CheckStateChange(gameProxy)
    {
        if(this.stateHasChanged)
        {
            gameProxy.LoadGameState(this.currentState);
            this.stateHasChanged = false;
        }
    }
}

class MainGame extends GameState
{
    constructor()
    {
        super();

        this.snake = new Snake(100, 100, 10, 10);

        this.foodController = new FoodController();
        this.foodController.SpawnFood(this.snake);

        this.gameOver = new GameOverText();

        this.score = new ScoreText();

        var keyboard = new KeyBoard();
        keyboard.AddKeyBoardCommand(new KeyBoardDownCommand(this.snake));
        keyboard.AddKeyBoardCommand(new KeyBoardUpCommand(this.snake));
        keyboard.AddKeyBoardCommand(new KeyBoardLeftCommand(this.snake));
        keyboard.AddKeyBoardCommand(new KeyBoardRightCommand(this.snake));

        this.AddKeyBoard(keyboard);

        this.AddGameObject(this.score);
        this.AddGameObject(this.foodController);
        this.AddGameObject(this.snake);
        this.AddGameObject(this.gameOver);
    }

    Draw(ctx)
    {
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
        let cBoxes = [];

        // check snake collision with itself
        if(this.snake.CheckCollisionWithSelf())
        {
            this.gameOver.SetGameOver(true);
            this.snake.SetIsDead(true);
            setTimeout(() => { this.ChangeState(new MainMenu()); }, 3000);
        }


        for(let i=0; i < this.gameObjects.length; i++)
        {
            if(this.gameObjects[i].CheckCollision == null)
            {
                continue;
            }

            // check all other objects
            for(let k=0; k < this.gameObjects.length; k++)
            {
                if(this.gameObjects[k].CheckCollision == null)
                {
                    continue;
                }

                if(this.gameObjects[i] == this.gameObjects[k])
                {
                    continue;
                }

                cBoxes = this.gameObjects[k].GetCboxArray();

                for(let h=0; h < cBoxes.length; h++)
                {
                    if(this.gameObjects[i].CheckCollision(cBoxes[h]))
                    {
                        if(this.gameObjects[i] instanceof Snake && this.gameObjects[k] instanceof FoodController)
                        {
                            this.gameObjects[k].SpawnFood(this.gameObjects[i]);
                            this.gameObjects[i].AddBodyNode();
                            this.score.IncrememntScore();
                        }
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

class MainMenu extends GameState
{
    constructor()
    {
        super();

        this.titleText = new TitleText();
        this.startText = new StartText();

        var keyboard = new KeyBoard();
        keyboard.AddKeyBoardCommand(new KeyBoardSpaceCommand(this));

        this.AddKeyBoard(keyboard);

        this.AddGameObject(this.titleText);
        this.AddGameObject(this.startText);
    }

    Draw(ctx)
    {
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

    Move() { }

    Logic() { }

    CheckCollisions() { }

    Cycle()
    {
        // input is already handled as a window event listener. See this.keyBoard.SetKeyBoardListener()
        this.Draw();
    }

}

 

var game = new Game();
var mainMenu = new MainMenu();
game.LoadGameState(mainMenu);
var gameLoopInterval = setInterval(() => {game.Cycle()}, 125);
