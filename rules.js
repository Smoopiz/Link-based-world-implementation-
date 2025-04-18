class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title);
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        const loc = this.engine.storyData.Locations[key];

        if (loc.Scene && window[loc.Scene]) {
            this.engine.gotoScene(window[loc.Scene], key);
            return;
        } 

        this.engine.setTitle(key);
        this.engine.show(loc.Body);

        if (loc.Item) {
            this.engine.inventory = this.engine.inventory || [];
            if (!this.engine.inventory.includes(loc.Item)) {
                this.engine.inventory.push(loc.Item);
                this.engine.show(`<b>You found an item: ${loc.Item}</b>`);
            }
        }

        if (loc.Choices && loc.Choices.length > 0) {
            for (let choice of loc.Choices) {
                const required = choice.RequiredItem;
                const hasItem = !required || (this.engine.inventory && this.engine.inventory.includes(required));
                if (hasItem) {
                    this.engine.addChoice(choice.Text, choice);
                }
            }
        } else {
            this.engine.addChoice("The end.");
        }
    }

    handleChoice(choice) {
        if (choice) {
            this.engine.show("&gt; " + choice.Text);

            const nextLocation = this.engine.storyData.Locations[choice.Target];
            const sceneClass = nextLocation?.Scene && window[nextLocation.Scene] ? window[nextLocation.Scene] : Location;
            this.engine.gotoScene(sceneClass, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class GateLogic extends Scene {
    create() {
        this.engine.inventory = this.engine.inventory || [];
        this.engine.setTitle("Gate");

        if (this.engine.inventory.includes("GateKey")) {
            this.engine.show("This key, and this last gate. My future and present are all relying on this one single action to work. I want it to work, no. I need it to work.");
            this.engine.addChoice("You pull out the key", {Text: "Pull out the key", Target: "Freedom"});
        } else {
            this.engine.show("Police… Of course they're here, but never this much. I wonder why… Wait are they walking here? Please no… anything but that.");
            this.engine.addChoice("They're dragging you away", {Text: "They're dragging you away", Target: "Police Ambush"});
        }
    }

    handleChoice(choice) {
        this.engine.show("&gt; " + choice.Text);

        const nextLocation = this.engine.storyData.Locations[choice.Target];
        const sceneClass = nextLocation?.Scene && window[nextLocation.Scene] ? window[nextLocation.Scene] : Location;
        this.engine.gotoScene(sceneClass, choice.Target);
    }
}
window.GateLogic = GateLogic;

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');