function logJsonErr(err, jsonString) {
    console.error('Invalid or too old ADOFAI level');
    console.error(err);

    let stringErr = err.toString();
    if (stringErr.startsWith('SyntaxError:') && stringErr.includes('JSON')) { // Check if it's json error
        let parsableString = ADOFAIParser.prototype.convertToParsable(jsonString);

        // Check if it's double-quoted property error
        if (stringErr.startsWith('SyntaxError: Expected double-quoted property name in JSON at position')) {
            let errorIndex = parseInt(stringErr.split(' ').pop());
            let lineCount = 0;

            for (var i = errorIndex; i >= errorIndex - 200; i--) {
                if (parsableString[i] == '\n') lineCount++;
                if (lineCount >= 2 || i <= 0) {
                    console.log('%c오류 부분', 'font-size: 25px; color: #FF8080; font-weight: 500; font-family: \'SUIT Variable\', sans-serif;');
                    console.log(parsableString.slice(i, i + 400));
                    break;
                }
            }
        } else {
            console.log(parsableString);
        }
    }
}