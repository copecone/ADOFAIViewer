document.addEventListener('DOMContentLoaded', () => {
    let filebox = new FileBoxUI();
    let brTag = document.createElement('br');
    
    function loadADOFAI(filebox, filename, result) {
        filebox.setText(filename);
        
        let parser; let infoText;
        
        try {
            parser = new ADOFAIParser(result);
        } catch (err) {
            logJsonErr(err, result);
            
            infoText = 
                `<size=40px color=#FF9494>오류</size color>
                Error: Invalid or too old ADOFAI level
                (See the console for more details)`;
        }
        
        setupInfoUI(parser);
    }
    
    function setupInfoUI(parser) {
        addLine();
        
        // 종합 개요
        let decorations = 0; let texts = 0;
        parser.decorations.forEach((decoration) => {
            if (decoration.eventType == 'AddDecoration') decorations++;
            if (decoration.eventType == 'AddText') texts++;
        });
        
        let levelInfoBox = new BoxUI(); levelInfoBox.addClass('level-info');
        levelInfoBox.setText(
            `<size=40px>개요</size>
            ${parser.angleData.length} Tiles
            ${parser.actions.length} Events
            ${decorations} Decorations
            ${texts} Texts

            BPM: ${parser.settings.bpm}

            Song: ${parser.settings.artist} - ${parser.settings.song}</size color>
            Level by ${parser.settings.author}</size color>`
        );
        levelInfoBox.addTo(document.body);
        
        // 장식 개요
        let decorationMoves = 0;
        let decorationChanges = 0;
        let decorationImages = 0;
        
        let decorationUsage = {};
        parser.decorations.forEach((decoration) => {
            if (decoration.eventType == 'AddDecoration') {
                if (!decorationUsage.hasOwnProperty(decoration.decorationImage)) {
                    decorationImages++;
                    decorationUsage[decoration.decorationImage] = 1;
                } else {
                    decorationUsage[decoration.decorationImage]++;
                }
            }
        });
        
        let textChanges = parser.actionTypes.SetText?.length ?? 0;
        parser.actionTypes.MoveDecorations?.forEach((decoration) => {
            decorationMoves++;
            if (decoration.hasOwnProperty('decorationImage')) {
                decorationChanges++;
                
                if (!decorationUsage.hasOwnProperty(decoration.decorationImage)) {
                    decorationImages++;
                    decorationUsage[decoration.decorationImage] = 1;
                } else {
                    decorationUsage[decoration.decorationImage]++;
                }
            }
        });
        
        let decoInfoBox = new BoxUI(); decoInfoBox.addClass('level-info');
        decoInfoBox.setText(
            `<size=40px>장식 개요</size>
            ${decorations} Decorations
            
            ${decorationMoves} Decoration Moves
            ${decorationChanges} Decoration Changes
            ${decorationImages} Images Used
            
            ${texts} Texts
            ${textChanges} Text Changes
            `
        );
        decoInfoBox.addTo(document.body);
    }
    
    filebox.addTo(document.body);
    
    filebox.addFileListener((event) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            loadADOFAI(filebox, event.target.files[0].name, reader.result);
        });

        filebox.setText('Loading');
        reader.readAsText(event.target.files[0], 'utf-8');
    });
});