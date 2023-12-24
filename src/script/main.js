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
            
            let errorBox = new BoxUI();
            errorBox.setText( 
                `<size=40px color=#FF9494>오류</size color>
                오류: 유효하지 않거나 너무 오래된 ADOFAI 레벨입니다
                (자세한 사항은 콘솔에서 확인하세요)`
            );
            
            addLine();
            errorBox.add();
            errorBox.setSpaced(true);
            
            return;
        }
        
        setupInfoUI(parser);
    }
    
    function setupInfoUI(parser) {
        // addLine();
        
        let reloadBox = new BoxUI();
        reloadBox.setText('<size=60px>파일 언로드</size>');
        reloadBox.setCursor('pointer');
        reloadBox.click((event) => {
            filebox.setText(null);
            filebox.clearFile();
            
            console.log(filebox)
            clearUI((element) => {
                if (element.uuid != filebox.uuid) element.remove();
                console.log(element)
            });
        });
        
        reloadBox.setSpaced(true);
        reloadBox.add();
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
            타일 ${parser.angleData.length}개
            이벤트 ${parser.convertedActions.length}개 (반복 ${parser.convertedActions.length - parser.actions.length}개)
            장식 ${decorations}개
            텍스트 ${texts}개

            BPM: ${parser.settings.bpm}

            음악: ${parser.settings.artist} - ${parser.settings.song}</size color>
            레벨 제작자: ${parser.settings.author}</size color>`
        );
        levelInfoBox.add();
        
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
        parser.convertedActionTypes.MoveDecorations?.forEach((decoration) => {
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
            장식 ${decorations}개
            
            장식 이동 ${decorationMoves}번
            장식 교체 ${decorationChanges}번
            이미지 ${decorationImages}개 사용
            
            텍스트 ${texts}개
            텍스트 교체 ${textChanges}번
            `
        );
        decoInfoBox.add();
        
        // 필터 개요
        let filterEvents = 0;
        let validFilterEvents = 0;
        
        let filterToggles = 0;
        let filterUsage = {};
        let filterStatus = {};
        let filterUsed = {};
        
        let filterCount = 0;
        let validFilterCount = 0;
        
        parser.convertedActionTypes.SetFilter?.forEach((filter) => {
            filterEvents++;
            if (filter.enabled == 'Enabled' || filter.enabled == true) { // 필터를 활성화하는 이벤트
                if (!filterUsed[filter.filter] || !filterUsed.hasOwnProperty(filter.filter)) { // 첫 필터 활성화
                    validFilterCount++;
                    filterUsed[filter.filter] = true;
                    // console.log(filter);
                }
                
                if (!filterUsage.hasOwnProperty(filter.filter)) { // 첫 필터 사용 (활성화)
                    // console.log(filter);
                    filterCount++; validFilterEvents++; filterToggles++;
                    filterUsage[filter.filter] = 1;
                } else {
                    if (filter.intensity !== filterStatus[filter.filter]) { // 필터 상태가 다를 때
                        validFilterEvents++;
                        if (filterStatus[filter.filter] === false) filterToggles++; // 필터가 꺼져 있었을 때
                        
                        console.log(filter);
                    }
                    
                    filterUsage[filter.filter]++;
                }
                
                filterStatus[filter.filter] = filter.intensity;
            } else if (filter.enabled == 'Disabled' || filter.enabled == false) { //필터를 비활성화하는 이벤트
                if (!filterUsage.hasOwnProperty(filter.filter)) { // 첫 필터 사용 (비활성화)
                    filterCount++;
                    
                    filterUsage[filter.filter] = 1;
                    filterUsed[filter.filter] = false;
                    filterStatus[filter.filter] = false;
                } else {
                    if (filterStatus[filter.filter] !== false) { // 필터가 켜져 있었을 때
                        validFilterEvents++; filterToggles++;
                        filterStatus[filter.filter] = false;
                    }
                    
                    filterUsage[filter.filter]++;
                }
            }
        });
        
        let filterInfoBox = new BoxUI(); filterInfoBox.addClass('level-info');
        filterInfoBox.setText(
            `<size=40px>필터 개요</size>
            필터 이벤트 ${filterEvents}개
            유효 필터 이벤트 ${validFilterEvents}개 (근삿값)
            필터 ON/OFF ${filterToggles}개 (근삿값)
            
            필터 ${filterCount}개 사용
            유효한 필터 ${validFilterCount}개 사용
            
            거울의 방 이벤트 ${parser.convertedActionTypes.HallOfMirrors?.length ?? 0}개
            `
        );
        filterInfoBox.add();
    }
    
    filebox.add();
    filebox.addFileListener((event) => {
        console.log(event)
        
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            loadADOFAI(filebox, event.target.files[0].name, reader.result);
        });

        filebox.setText('Loading');
        try {
            reader.readAsText(event.target.files[0], 'utf-8');
        } catch (err) {
            filebox.setText(`<size=40px>오류</size>\n알 수 없는 파일 읽기 오류가 발생했습니다\n(자세한 사항은 콘솔에서 확인하세요)`);
        }
    });
});