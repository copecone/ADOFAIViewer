let __ui_uuid = 0;

function getUUID() {
    __ui_uuid++;
    return __ui_uuid - 1;
}

class UI {
    constructor() {
        this.element = document.createElement('div');
    }
    
    addClass(className) {
        this.element.classList.add(className);
    }
    
    addTo(element) {
        element.appendChild(this.element);
    }
    
    /* Direction: 'down'으로 아래로 배치, 'left'로 옆으로 배치 */
    setPlacement(direction) {
        if (direction == 'down') {
            this.element.style.float = 'none';
        } else if (direction == 'left') {
            this.element.style.float = 'left';
        }
    }
}

class FileBoxUI extends UI {
    constructor() {
        super();
        
        // Create Filebox Element
        // this.element = document.createElement('div');
        this.element.classList.add('filebox');
        this.element.classList.add('box-ui');
        
        this.uuid = getUUID();
        
        // Create Label
        this.label = document.createElement('label');
        this.label.setAttribute('for', `input_file${this.uuid}`);
        
        // Load Material Folder Icon
        let folderIcon = document.createElement('span');
        folderIcon.classList.add('material-symbols-outlined');
        folderIcon.classList.add('file-selection');
        folderIcon.innerText = 'folder_open';
        
        // UI When File Not Selected
        this.fileNotSelected = document.createElement('div');
        this.fileNotSelected.classList.add('file-not-selected');
        this.fileNotSelected.innerText = '파일을 선택해주세요';
        this.fileNotSelected.appendChild(folderIcon);
        
        // UI When File Selected
        this.fileSelected = document.createElement('div');
        this.fileSelected.classList.add('file-selected');
        this.fileSelected.classList.add('invisible');
        this.fileSelected.innerText = 'filename';
        
        // Add File Selection UI on Label
        this.label.appendChild(this.fileNotSelected);
        this.label.appendChild(this.fileSelected);
        
        this.element.appendChild(this.label);
        
        this.inputbox = document.createElement('input');
        
        this.inputbox.setAttribute('type', 'file');
        this.inputbox.setAttribute('id', `input_file${this.uuid}`);
        this.inputbox.setAttribute('accept', '.adofai');
        
        this.inputbox.classList.add('invisible');
        this.element.appendChild(this.inputbox);
        
        // Add Event Listener System
        this.listeners = [];
        this.inputbox.addEventListener('change', (event) => {
            this.listeners.forEach((listener) => {
                listener(event);
            });
        });
    }
    
    setText(text) {
        if (text == null) {
            this.fileNotSelected.classList.remove("invisible");
            
            this.inputbox.disabled = false;
            this.fileSelected.classList.add("invisible");
            this.fileSelected.innerText = 'filename';
            this.label.style.cursor = 'pointer';
        } else {
            this.fileNotSelected.classList.add("invisible");
        
            this.inputbox.disabled = true;
            this.fileSelected.innerText = text;
            this.fileSelected.classList.remove("invisible");
            this.label.style.cursor = 'default';
        }
    }
    
    addFileListener(listener) {
        this.listeners.push(listener);
    }
}

class BoxUI extends UI {
    constructor() {
        super();
        
        // this.element = document.createElement('div');
        this.element.classList.add('box-ui');
        super.setPlacement('left');
    }
    
    setText(text) {
        this.element.innerHTML = '';
        this.element.appendChild(parseText(text));
    }
}