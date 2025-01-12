class Button{
    constructor(number, color, width = 10, height = 5){
        this.number = number;
        this.color = color;
        this.width = width;
        this.height = height;
        
        this.button = document.createElement('button');
        this.button.textContent = this.number;
        this.button.style.backgroundColor = this.color;
        this.button.style.width = this.width +'em';
        this.button.style.height = this.height + 'em';
        this.button.style.border = 'none';
        this.button.style.outline = '2px solid';
        this.button.style.margin = '1em';
        this.button.style.position = 'relative';
        this.button.style.display = 'inline-block';
        document.body.appendChild(this.button);
    }

    // chatgpt idea to move the button to a random location
    // minus -5px(random number) to prevent the button edge from going exactly to the edge of the screen
    move(){
        const newLeft = Math.random() * (window.innerWidth - this.width*16 - 5);
        const newTop = Math.random() * (window.innerHeight - this.height*16 - 5);
        // Apply the new position directly
        this.button.style.position = 'absolute';
        this.button.style.left = newLeft + 'px';
        this.button.style.top = newTop + 'px';
    }
}

class ButtonManager {
    constructor(){
        this.buttonContainer = [];
    }

    async createButtons(buttonCount){
        this.clearButtons();
        if(this.checkValidInputRange(buttonCount)){
            for(let i = 0; i < buttonCount; ++i){
                let color = this.getRandomColor();
                this.buttonContainer.push(new Button(i+1,color))
                console.log(this.buttonContainer[i]);
                console.log("button created");
            }
            this.buttonContainer.forEach(button => button.button.style.cursor = 'pointer');
            await this.scrambleButtons(this.buttonContainer, buttonCount);
            return true;
        } 
        else{
            alert(messages.wrongButtonCount);
            return false;
        }
       
    }

    //chatGPT with prompt: how to make a random hexa string for color
    getRandomColor(){
        const colorString = '0123456789ABCDEF';
        let color = '#';
        const hexa = 6;
        for(let i = 0; i < hexa; ++i){
            color += colorString[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    // Function to clear all buttons if the user wants to 
    // start over the game by inputting a new number of buttons
    clearButtons() {
        this.buttonContainer.forEach(button => {
            document.body.removeChild(button.button); // Remove the button from the DOM
        });
        this.buttonContainer = []; // Clear the arra
        console.log("All buttons cleared");
    }

    
    //chatGPT idea to scramble the buttons to random locations
    scrambleButtons(buttonContainer, n){
        return new Promise(resolve  => {

            // Pause for `n` seconds before starting the scrambling process
            setTimeout(() => {
            // disable all button intially when scrambling
            this.buttonContainer.forEach(button => {
                button.button.disabled = true;
                button.button.style.cursor = 'default';
            })
                let counter = 0;
                const interval = setInterval(() => {
                    if(counter < n){
                        this.buttonContainer.forEach(button => button.move());  // Move buttons to random positions
                        counter++;
                    } else {
                        clearInterval(interval); // Stop the interval once buttons have been scrambled `n` times
                        
                        //enable all buttons to be clickable after scrambling is complete
                        this.buttonContainer.forEach(button => {
                            button.button.disabled = false;
                        })
                        console.log("finish scramble");
                        resolve();
                    }
                }, 2000); //Scramble buttons every 2 seconds
            }, n*1000); // Initial pause of `n` seconds
        });
    }

    // after scrambling the buttons, hide the content of the buttons so that
    // the user can start the game by clicking the buttons in the correct order
    hideButtonContent(){
        this.buttonContainer.forEach(button => button.button.textContent = '');
    }

    // Validate input range
    checkValidInputRange(count) {
        return count >= 3 && count <= 7;
    }

}


class GameController{
    constructor(buttonManager){
        this.buttonManager = buttonManager;
        this.clickCount = 0;
    }

    async startGame(buttonCount){
        let check = await this.buttonManager.createButtons(buttonCount);
        if(check){
            // hide the numbers from the buttons
            this.buttonManager.hideButtonContent();
            // make the buttons clickable
            this.buttonClickable();
            // let the user test their memory to remember their orders. 
            this.trackUserClick();
        }
    }

    buttonClickable(){
        this.buttonManager.buttonContainer.forEach(button => button.button.style.cursor = 'pointer');
    }

    trackUserClick(){
        this.clickCount = 0;
        this.buttonManager.buttonContainer.forEach(button => {
            button.button.addEventListener('click', () => {
                let index = this.buttonManager.buttonContainer.indexOf(button);
                button.button.textContent = index + 1;
                if(index != this.clickCount){
                    alert(messages.wrongOrder);
                    this.buttonManager.buttonContainer.forEach(button => button.button.textContent = this.buttonManager.buttonContainer.indexOf(button) + 1)
                    return;
                }
                this.clickCount++;
                if(this.clickCount === this.buttonManager.buttonContainer.length){
                    setTimeout(() => {
                        alert(messages.correctOrder);
                    },300);
                }
            });
        });
    }
}

//chatGPT idea to create a button manager and game controller
// so that at least 3 classes requirement is satisfied
const buttonManager = new ButtonManager();
const gameController = new GameController(buttonManager);

// ensure the DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    const goButton = document.getElementById("goButton");
    if (goButton) {
        goButton.addEventListener("click", () => {
            console.log("button clicked");
            const buttonCount = document.getElementById('buttonCount').value;
            gameController.startGame(buttonCount);
        });
    } else {
        console.log("goButton element not found in the DOM.");
    }
});





