function createTextElement(text, tags) {
    let element = document.createElement('div');
    element.classList.add('rich-text');
    
    if (tags.size != null) element.style.fontSize = tags.size;
    if (tags.color != null) element.style.color = tags.color;
    
    element.innerText = text;
    return element;
}

function parseText(text) {
    let element = document.createElement('div');
    
    let currentStr = '';
    
    let tagMode = false;
    
    let defaultTags = {'size': null, 'color': null};
    let tags = {'size': null, 'color': null};
    
    let tagRemoval = false;
    let tagName = null;
    let tagIndex = -1;
    for (var i = 0; i < text.length; i++) {
        currentStr += text[i];
        
        if (currentStr.endsWith('<') && currentStr.slice(-2)[0] !== '\\') {
            tagMode = true;
            if (currentStr.length > 1) {
                let newElement = createTextElement(currentStr.slice(0, -1), tags);
                element.appendChild(newElement);
            }
            
            currentStr = currentStr.slice(-1);
            tagIndex = 1;
        } else if (currentStr.length == 2 && currentStr.endsWith('/')) {
            tagRemoval = true;
        }
        
        if (tagMode && currentStr.endsWith('>') && currentStr.slice(-2)[0] !== '\\') {
            tagMode = false;
            tagIndex = -1;
            
            if (tagRemoval) {
                let tagNames = currentStr.slice(2, -1).split(' ');
                for (var j = 0; j < tagNames.length; j++) {
                    if (tags.hasOwnProperty(tagNames[j])) {
                        tags[tagNames[j]] = defaultTags[tagNames[j]];
                    }
                }
            }
            
            currentStr = '';
        }
        
        if (tagMode && currentStr.endsWith('=') && tagIndex !== -1) {
            tagName = currentStr.slice(tagIndex, -1);
            if (tags.hasOwnProperty(tagName)) {
                currentStr = '';
                tagIndex = -1;
                tags[tagName] = '';
            }
        }
        
        if (tagMode && tagIndex == -1 && currentStr.length > 0) {
            if (!currentStr.endsWith(' ')) {
                tags[tagName] = currentStr;
            } else {
                currentStr = '';
                tagIndex = 0;
            }
        }
    }
    
    let newElement = createTextElement(currentStr, tags);
    element.appendChild(newElement);
    
    return element;
}

function addLine(element = document.body) {
    element.appendChild(document.createElement('br'));
}