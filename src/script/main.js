document.addEventListener('DOMContentLoaded', () => {
    let fileboxes = document.querySelectorAll(".filebox");
    
    function setFileBoxText(filebox, text) {
        let fileNotSelected = filebox.querySelector(".file-not-selected");
        let fileSelected = filebox.querySelector(".file-selected");
        let inputbox = filebox.querySelector("input[type=file]");
        
        if (text == null) {
            fileNotSelected.classList.remove("invisible");
            
            inputbox.disabled = false;
            fileSelected.classList.add("invisible");
            fileSelected.innerText = 'filename';
        } else {
            fileNotSelected.classList.add("invisible");
        
            inputbox.disabled = true;
            fileSelected.innerText = text;
            fileSelected.classList.remove("invisible");
        }
    }
    
    function parseADOFAI(filebox, filename, result) {
        let fileNotSelected = filebox.querySelector(".file-not-selected");
        let fileSelected = filebox.querySelector(".file-selected");
        let inputbox = filebox.querySelector("input[type=file]");
        
        setFileBoxText(filebox, filename);
        
        console.log(result);
    }
    
    fileboxes.forEach((filebox) => {
        let fileinput = filebox.querySelector("input[type=file]");
        
        fileinput.addEventListener('change', (event) => {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                parseADOFAI(filebox, event.target.files[0].name, reader.result);
            });
            
            setFileBoxText(filebox, 'Loading');
            reader.readAsText(event.target.files[0], 'utf-8');
        });
    });
});