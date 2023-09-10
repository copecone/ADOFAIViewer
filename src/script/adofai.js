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
        
        this.actionTypes = {};
        this.actions.forEach((action) => {
            // console.log(action.floor);
            this.tiles[action.floor].events.push(action);
            if (this.actionTypes.hasOwnProperty(action.eventType)) {
                this.actionTypes[action.eventType].push(action);
            } else {
                this.actionTypes[action.eventType] = [action];
            }
        });
    }
    
    convertToParsable(string) {
        const regex = /(\"decText\"\:\ \")([^\n\r\"]*)([\r?\n]+)([^\n\r,"]*)(")/g;
        
        let result = string
            .replaceAll('\r\n', '\n')
            .replaceAll(', },\n', ' },\n')
            .replaceAll(', }\n\t]', ' }\n\t]').replaceAll(',  }\n\t]', '  }\n\t]')
            .replaceAll(',  },\n\t\t', '  },\n\t\t')
            .replaceAll('],,\n\t\t', '],\n\t\t')
            .replaceAll('\t]\n\t"decorations":\n\t[', '\t],\n\t"decorations":\n\t[');
        
        // console.log(result);
        
        const subst = `$1$2\\n$4$5`;
        function replacer(match, p1, p2, p3, p4, p5) {
            return p1 + p2 + p3.replaceAll('\n', '\\n').replace('\t', '\\t') + p4 + p5;
        }
        
        result = result.replaceAll(regex, replacer);
        return result;
    }
}