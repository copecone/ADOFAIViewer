class ADOFAITile {
    constructor(angle) {
        this.angle = angle;
        this.events = [];
    }
}

let wtf;
class ADOFAIParser {
    constructor(adofaiString) {
        this.parsableString = this.convertToParsable(adofaiString);
        this.adofaiLevel = JSON.parse(this.parsableString);
        
        console.log(this.parsableString);

        this.angleData = this.adofaiLevel.angleData;
        this.settings = this.adofaiLevel.settings;
        this.actions = this.adofaiLevel.actions;
        
        this.decorations = this.adofaiLevel.decorations;
        
        this.tiles = [new ADOFAITile(0)];
        this.angleData.forEach((angle) => {
            this.tiles.push(new ADOFAITile(angle));
        });
        
        this.convertedTiles = this.tiles;
        
        this.actionTags = {};
        this.actionTypes = {};
        this.actionRepeats = {};
        this.actions.forEach((action) => {
            // console.log(action.floor);
            this.tiles[action.floor].events.push(action);
            if (this.actionTypes.hasOwnProperty(action.eventType)) {
                this.actionTypes[action.eventType].push(action);
            } else {
                this.actionTypes[action.eventType] = [action];
            }
            
            if (action.hasOwnProperty('eventTag') && action.eventTag !== '') {
                let eventTags = action.eventTag.split(' ');
                eventTags.forEach((tag) => {
                    if (this.actionTags.hasOwnProperty(tag)) this.actionTags[tag].push(action);
                    else this.actionTags[tag] = [action];
                });
            } else if (action.eventType == 'RepeatEvents') {
                let targetTags = action.tag.split(' ');
                targetTags.forEach((tag) => {
                    if (this.actionRepeats.hasOwnProperty(action.floor)) {
                        if (this.actionRepeats[action.floor].hasOwnProperty(tag)) {
                            this.actionRepeats[action.floor][tag].push({
                                floor: action.floor, eventType: 'RepeatEvents', 
                                repetitions: action.repetitions, interval: action.interval
                            });
                        } else {
                            this.actionRepeats[action.floor][tag] = [{
                                floor: action.floor, eventType: 'RepeatEvents', 
                                repetitions: action.repetitions, interval: action.interval
                            }];
                        }
                    } else {
                        this.actionRepeats[action.floor] = {};
                        this.actionRepeats[action.floor][tag] = [{
                            floor: action.floor, eventType: 'RepeatEvents', 
                            repetitions: action.repetitions, interval: action.interval
                        }];
                    }
                });
            }
        });
        
        this.convertedActionTypes = {};
        this.convertedActions = [];
        
        this.actions.forEach((action) => {
            if (action.hasOwnProperty('eventTag')) {
                this.convertedActions.push(action);
                
                if (this.actionRepeats.hasOwnProperty(action.floor)) {
                    let eventTags = action.eventTag.split(' ');
                    eventTags.forEach((eventTag) => {
                        if (this.actionRepeats[action.floor].hasOwnProperty(eventTag)) {
                            let currentRepeats = this.actionRepeats[action.floor][eventTag];
                            currentRepeats.forEach((repeat) => {
                                for (var i = 0; i < repeat.repetitions; i++) {
                                    let actionCopy = {};
                                    for (var key in action) {
                                        if (key != 'angleOffset') {
                                            actionCopy[key] = action[key];
                                        } else {
                                            actionCopy[key] = action[key] + ((i + 1) * repeat.interval) * 180;
                                        }
                                    }
                                    
                                    // console.log(actionCopy);
                                    this.convertedActions.push(actionCopy); // 반복 횟수
                                }
                            });
                        }
                    });
                }
            } else {
                this.convertedActions.push(action);
            }
        });
        
        this.convertedActions.forEach((action) => {
            // console.log(action.floor);
            this.convertedTiles[action.floor].events.push(action);
            if (this.convertedActionTypes.hasOwnProperty(action.eventType)) {
                this.convertedActionTypes[action.eventType].push(action);
            } else {
                this.convertedActionTypes[action.eventType] = [action];
            }
        });
        
        // console.log(this.convertedActions);
    }
    
    convertToParsable(string) {
        const regex = /(\"decText\"\:\ \")([^\n\r\"]*)([\r?\n]+)([^\n\r,"]*)(")|(\"comment\"\:\ \")([^\n\r\"]*)([\r?\n]+)([^\n\r,"]*)(")/g;
        
        let result = string
            .replaceAll('\r\n', '\n')
            .replaceAll(', },\n', ' },\n')
            .replaceAll(', }\n\t]', ' }\n\t]').replaceAll(',  }\n\t]', '  }\n\t]')
            .replaceAll(',  },\n\t\t', '  },\n\t\t')
            .replaceAll('],,\n\t\t', '],\n\t\t')
            .replaceAll('\t]\n\t"decorations":\n\t[', '\t],\n\t"decorations":\n\t[');
        
        // console.log(result);
        
        const subst = `$1$2$6$7\\n$4$5$9$10`;
        /*function replacer(match, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10) {
            return p1 + p2 + p3.replaceAll('\n', '\\n').replace('\t', '\\t') + p4 + p5;
        }*/
        
        result = result.replaceAll(regex, subst);
        return result;
    }
}
