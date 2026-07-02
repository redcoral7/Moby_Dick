
    let totalTables = 0;
    const tableStates = {}; 

    const suits = ['♠', '◆', '♥', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const diceEmojis = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

    const rouletteNumbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

    function initializeArcadeGrid() {
        const select = document.getElementById('table-count-select');
        totalTables = parseInt(select.value);

        document.getElementById('setup-view').classList.add('hidden');
        document.getElementById('arcade-header').classList.remove('hidden');
        
        const viewport = document.getElementById('arcade-viewport');
        viewport.innerHTML = ''; 
        viewport.classList.remove('hidden');
        viewport.className = `arcade-grid grid-${totalTables}`;

        for (let i = 1; i <= totalTables; i++) {
            tableStates[i] = { type: 'none' }; 
            viewport.innerHTML += createSlotHTML(i);
        }
    }

    function createSlotHTML(id) {
        return `
            <div id="slot-${id}" class="table-slot">
                <div class="table-header">
                    <span class="table-id">TABLE-0${id}</span>
                    <h3 id="title-${id}" class="table-title-text">공석 (대기 중)</h3>
                </div>
                
                <div id="select-layer-${id}" class="game-selector">
                    <div class="name-input-box">
                        <label for="slot-name-${id}">👤 테이블 딜러 커스텀 레이블 명칭</label>
                        <input type="text" id="slot-name-${id}" placeholder="테이블 명칭을 지정하세요" maxlength="15">
                    </div>
                    <button class="action-btn-primary" style="width:90%; padding:9px; margin-bottom:5px;" onclick="setupGame(${id}, 'blackjack')">♣️ 블랙잭 테이블 오픈</button>
                    <button class="action-btn-primary" style="width:90%; padding:9px; margin-bottom:5px;" onclick="setupGame(${id}, 'oddeven')">🎲 다이스 홀짝 오픈</button>
                    <button class="action-btn-primary" style="width:90%; padding:9px;" onclick="setupGame(${id}, 'roulette')">🎡 로얄 룰렛 휠 오픈</button>
                </div>

                <div id="play-layer-${id}" class="hidden" style="display:flex; flex-direction:column; flex-grow:1;">
                    <div class="bet-box">
                        <label>💵 BET CHIPS : </label>
                        <input type="number" id="bet-${id}" value="100" min="1"> <span>CHIPS</span>
                    </div>

                    <div id="bj-board-${id}" class="hidden">
                        <div class="game-section">
                            <h4>딜러 핸드 (Dealer's Box)</h4>
                            <div id="bj-dcards-${id}" class="display-output">-</div>
                            <div id="bj-dscore-${id}" class="score">점수: 0</div>
                        </div>
                        <div class="game-section">
                            <h4>플레이어 핸드 (Player's Box)</h4>
                            <div id="bj-pcards-${id}" class="display-output">-</div>
                            <div id="bj-pscore-${id}" class="score">점수: 0</div>
                        </div>
                    </div>

                    <div id="oe-board-${id}" class="hidden">
                        <div class="game-section" style="text-align:center;">
                            <h4>배팅 구역 (Layout Position)</h4>
                            <button id="oe-oddbtn-${id}" class="oe-choice" onclick="oeSelect(${id}, 'odd')">홀 (Odd)</button>
                            <button id="oe-evenbtn-${id}" class="oe-choice" onclick="oeSelect(${id}, 'even')">짝 (Even)</button>
                        </div>
                        <div class="game-section">
                            <h4>다이스 결과 (Dice Result)</h4>
                            <div id="oe-dice-${id}" class="dice-output" style="text-align:center;">🎲 🂠</div>
                        </div>
                    </div>

                    <div id="ro-board-${id}" class="hidden">
                        <div class="game-section">
                            <div class="ro-board-grid">
                                <div>
                                    <label style="font-size:11px; color:#c49a3c; font-weight:bold;">BET TYPE</label>
                                    <select id="ro-type-${id}" onchange="roTypeChange(${id})">
                                        <option value="color">색상 (Red/Black)</option>
                                        <option value="oe">홀짝 (Odd/Even)</option>
                                        <option value="number">숫자 지정 (0~36)</option>
                                    </select>
                                </div>
                                <div>
                                    <label style="font-size:11px; color:#c49a3c; font-weight:bold;">SELECTION</label>
                                    <select id="ro-target-select-${id}">
                                        <option value="red">🔴 Red (빨강)</option>
                                        <option value="black">⚫ Black (검정)</option>
                                    </select>
                                    <input type="number" id="ro-target-number-${id}" class="hidden" min="0" max="36" value="7">
                                </div>
                            </div>
                        </div>
                        
                        <div class="roulette-wrapper">
                            <div class="wheel-pointer"></div>
                            <div class="wheel-container">
                                <div id="wheel-canvas-${id}" class="wheel-canvas"></div>
                                <div class="wheel-center"></div>
                            </div>
                        </div>
                    </div>

                    <div id="msg-${id}" class="msg-line">배팅금을 조절한 뒤 베팅을 개시하세요.</div>
                    <div id="calc-${id}" class="calc-line"></div>
                    <div id="ctrl-${id}" style="margin-top:10px; display:flex; justify-content:center; gap:4px; flex-wrap:wrap;"></div>

                    <button class="reset-btn" onclick="resetSlot(${id})">⚙️ 테이블 마감 및 재오픈</button>
                </div>
            </div>
        `;
    }

    function setupGame(id, type) {
        const nameInput = document.getElementById(`slot-name-${id}`);
        let customName = nameInput.value.trim() || `테이블 0${id}`;

        document.getElementById(`select-layer-${id}`).classList.add('hidden');
        document.getElementById(`play-layer-${id}`).classList.remove('hidden');
        
        const slot = document.getElementById(`slot-${id}`);
        const title = document.getElementById(`title-${id}`);
        
        tableStates[id] = { type: type, isGameOver: true, currentBet: 0, customName: customName };

        if (type === 'blackjack') {
            slot.classList.add('blackjack-theme');
            title.innerText = `${customName} [BLACKJACK]`;
            document.getElementById(`bj-board-${id}`).classList.remove('hidden');
            bjRenderControls(id, 'ready');
        } else if (type === 'oddeven') {
            slot.classList.add('oddeven-theme');
            title.innerText = `${customName} [DICE O/E]`;
            document.getElementById(`oe-board-${id}`).classList.remove('hidden');
            tableStates[id].userChoice = null;
            oeRenderControls(id, 'ready');
        } else if (type === 'roulette') {
            slot.classList.add('roulette-theme');
            title.innerText = `${customName} [ROULETTE]`;
            document.getElementById(`ro-board-${id}`).classList.remove('hidden');
            tableStates[id].currentRotation = 0;
            roTypeChange(id);
            roRenderControls(id, 'ready');
        }
    }

    function resetSlot(id) {
        const slot = document.getElementById(`slot-${id}`);
        slot.className = 'table-slot';
        document.getElementById(`title-${id}`).innerText = '공석 (대기 중)';
        document.getElementById(`play-layer-${id}`).classList.add('hidden');
        document.getElementById(`bj-board-${id}`).classList.add('hidden');
        document.getElementById(`oe-board-${id}`).classList.add('hidden');
        document.getElementById(`ro-board-${id}`).classList.add('hidden');
        document.getElementById(`select-layer-${id}`).classList.remove('hidden');
        
        document.getElementById(`slot-name-${id}`).value = "";
        tableStates[id] = { type: 'none' };
    }

    /* 블랙잭 엔진 */
    function bjRenderControls(id, stage) {
        const ctrl = document.getElementById(`ctrl-${id}`);
        if (stage === 'ready') {
            ctrl.innerHTML = `<button class="action-btn-primary" style="width:100%;" onclick="bjStart(${id})">칩 배팅 & 카드 딜링 개시</button>`;
        } else if (stage === 'play') {
            ctrl.innerHTML = `
                <button class="action-btn-primary" onclick="bjHit(${id})">히트 (Hit)</button>
                <button class="action-btn-secondary" onclick="bjStand(${id})">스탠드 (Stand)</button>
            `;
        }
    }

    function bjStart(id) {
        const betVal = parseInt(document.getElementById(`bet-${id}`).value);
        if (isNaN(betVal) || betVal <= 0) return alert('정확한 칩 수량을 투입하십시오.');

        const state = tableStates[id];
        state.isGameOver = false;
        state.currentBet = betVal;

        state.deck = [];
        for (let suit of suits) {
            for (let value of values) { state.deck.push({ suit, value }); }
        }
        for (let i = state.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [state.deck[i], state.deck[j]] = [state.deck[j], state.deck[i]];
        }

        state.playerHand = [state.deck.pop(), state.deck.pop()];
        state.dealerHand = [state.deck.pop(), state.deck.pop()];

        document.getElementById(`msg-${id}`).className = 'msg-line';
        document.getElementById(`msg-${id}`).innerText = `🎲 카드를 분배하고 있습니다...`;
        document.getElementById(`calc-${id}`).innerText = '';
        document.getElementById(`bet-${id}`).disabled = true;

        bjRenderControls(id, 'play');
        bjUpdateDisplay(id, true);

        if (bjScore(state.playerHand) === 21) { bjEnd(id); }
    }

    function bjScore(hand) {
        let score = 0; let aceCount = 0;
        for (let card of hand) {
            if (['J', 'Q', 'K'].includes(card.value)) score += 10;
            else if (card.value === 'A') { score += 11; aceCount++; }
            else score += parseInt(card.value);
        }
        while (score > 21 && aceCount > 0) { score -= 10; aceCount--; }
        return score;
    }

    function bjUpdateDisplay(id, hideDealer) {
        const state = tableStates[id];
        document.getElementById(`bj-pcards-${id}`).innerText = state.playerHand.map(c => c.suit+c.value).join(' ');
        document.getElementById(`bj-pscore-${id}`).innerText = `점수: ${bjScore(state.playerHand)}`;

        if (hideDealer) {
            document.getElementById(`bj-dcards-${id}`).innerText = state.dealerHand[0].suit + state.dealerHand[0].value + ' 🂠';
            document.getElementById(`bj-dscore-${id}`).innerText = '점수: ?';
        } else {
            document.getElementById(`bj-dcards-${id}`).innerText = state.dealerHand.map(c => c.suit+c.value).join(' ');
            document.getElementById(`bj-dscore-${id}`).innerText = `점수: ${bjScore(state.dealerHand)}`;
        }
    }

    function bjHit(id) {
        const state = tableStates[id];
        if (state.isGameOver) return;
        state.playerHand.push(state.deck.pop());
        bjUpdateDisplay(id, true);
        if (bjScore(state.playerHand) > 21) bjEnd(id);
    }

    function bjStand(id) {
        const state = tableStates[id];
        if (state.isGameOver) return;
        while (bjScore(state.dealerHand) < 17) { state.dealerHand.push(state.deck.pop()); }
        bjEnd(id);
    }

    function bjEnd(id) {
        const state = tableStates[id];
        state.isGameOver = true;
        document.getElementById(`bet-${id}`).disabled = false;
        bjRenderControls(id, 'ready');
        bjUpdateDisplay(id, false);

        const p = bjScore(state.playerHand);
        const d = bjScore(state.dealerHand);
        let msg = document.getElementById(`msg-${id}`);
        let calc = document.getElementById(`calc-${id}`);
        let status = '';

        if (p > 21) { status = 'lose'; msg.innerText = 'Dealer Wins! 플레이어 버스트!'; }
        else if (d > 21) { status = 'win'; msg.innerText = 'Player Wins! 딜러 버스트!'; }
        else if (p > d) { status = 'win'; msg.innerText = 'Player Wins! 하이 스코어 달성!'; }
        else if (p < d) { status = 'lose'; msg.innerText = 'Dealer Wins! 스코어 미달 패배.'; }
        else { status = 'draw'; msg.innerText = '🤝 무승부 (Push) 칩 반환.'; }

        if (status === 'win') {
            msg.className = 'msg-line win-text';
            calc.innerText = `📈 CHIPS 정산 완료 (+${state.currentBet * 10} CHIPS)`;
            calc.className = 'calc-line win-text';
        } else if (status === 'lose') {
            msg.className = 'msg-line lose-text';
            calc.innerText = `📉 CHIPS 정산 완료 (-${state.currentBet * 5} CHIPS)`;
            calc.className = 'calc-line lose-text';
        } else {
            calc.innerText = '결과 정산: 0 CHIPS';
            calc.className = 'calc-line';
        }
    }

    /* 홀짝엔진 */
    function oeRenderControls(id, stage) {
        document.getElementById(`ctrl-${id}`).innerHTML = `<button class="action-btn-primary" style="width:100%;" onclick="oeRoll(${id})">다이스 컵 오픈 (Roll)</button>`;
    }

    function oeSelect(id, choice) {
        const state = tableStates[id];
        state.userChoice = choice;
        const oddBtn = document.getElementById(`oe-oddbtn-${id}`);
        const evenBtn = document.getElementById(`oe-evenbtn-${id}`);
        const msg = document.getElementById(`msg-${id}`);

        if (choice === 'odd') {
            oddBtn.classList.add('selected'); evenBtn.classList.remove('selected');
            msg.innerText = '🔮 [Odd / 홀수] 배팅 락인. 주사위를 오픈하십시오.';
        } else {
            evenBtn.classList.add('selected'); oddBtn.classList.remove('selected');
            msg.innerText = '🔮 [Even / 짝수] 배팅 락인. 주사위를 오픈하십시오.';
        }
        msg.className = 'msg-line';
    }

    function oeRoll(id) {
        const state = tableStates[id];
        const betVal = parseInt(document.getElementById(`bet-${id}`).value);
        if (isNaN(betVal) || betVal <= 0) return alert('정확한 칩 수량을 투입하십시오.');
        if (!state.userChoice) return alert('홀/짝 구역에 베팅을 먼저 결정하십시오.');

        state.currentBet = betVal;
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const sum = d1 + d2;
        const isOddResult = (sum % 2 !== 0);
        document.getElementById(`oe-dice-${id}`).innerText = `${diceEmojis[d1]} + ${diceEmojis[d2]} = ${sum} [${isOddResult ? '홀':'짝'}]`;

        const isWin = (state.userChoice === 'odd' && isOddResult) || (state.userChoice === 'even' && !isOddResult);
        let msg = document.getElementById(`msg-${id}`);
        let calc = document.getElementById(`calc-${id}`);

        if (isWin) {
            msg.innerText = '🎉 축하합니다! 베팅 포지션 적중.'; msg.className = 'msg-line win-text';
            calc.innerText = `📈 CHIPS 정산 완료 (+${state.currentBet * 5} CHIPS)`; calc.className = 'calc-line win-text';
        } else {
            msg.innerText = '❌ 하우스 승리! 베팅 포지션 이탈.'; msg.className = 'msg-line lose-text';
            calc.innerText = `📉 CHIPS 정산 완료 (-${state.currentBet * 5} CHIPS)`; calc.className = 'calc-line lose-text';
        }

        state.userChoice = null;
        document.getElementById(`oe-oddbtn-${id}`).classList.remove('selected');
        document.getElementById(`oe-evenbtn-${id}`).classList.remove('selected');
    }

    /* 룰렛엔진 */
    function roRenderControls(id, stage) {
        const ctrl = document.getElementById(`ctrl-${id}`);
        if (stage === 'ready') {
            ctrl.innerHTML = `<button class="action-btn-primary" style="width:100%;" onclick="roSpin(${id})">룰렛 휠 회전 트리거 (Spin)</button>`;
        } else if (stage === 'spinning') {
            ctrl.innerHTML = `<button class="action-btn-primary" style="width:100%;" disabled>No More Bets... (볼 롤링 중)</button>`;
        }
    }

    function roTypeChange(id) {
        const type = document.getElementById(`ro-type-${id}`).value;
        const select = document.getElementById(`ro-target-select-${id}`);
        const numInput = document.getElementById(`ro-target-number-${id}`);

        select.classList.add('hidden');
        numInput.classList.add('hidden');

        if (type === 'color') {
            select.classList.remove('hidden');
            select.innerHTML = `<option value="red">🔴 Red (빨강)</option><option value="black">⚫ Black (검정)</option>`;
        } else if (type === 'oe') {
            select.classList.remove('hidden');
            select.innerHTML = `<option value="odd">🔮 Odd (홀수)</option><option value="even">🔮 Even (짝수)</option>`;
        } else if (type === 'number') {
            numInput.classList.remove('hidden');
        }
    }

    function roSpin(id) {
        const betVal = parseInt(document.getElementById(`bet-${id}`).value);
        if (isNaN(betVal) || betVal <= 0) return alert('정확한 칩 수량을 투입하십시오.');

        const type = document.getElementById(`ro-type-${id}`).value;
        let prediction = "";

        if (type === 'color' || type === 'oe') {
            prediction = document.getElementById(`ro-target-select-${id}`).value;
        } else {
            const num = parseInt(document.getElementById(`ro-target-number-${id}`).value);
            if (isNaN(num) || num < 0 || num > 36) return alert('0~36 내부 번호를 선택하세요.');
            prediction = num;
        }

        const state = tableStates[id];
        state.currentBet = betVal;
        roRenderControls(id, 'spinning');
        
        document.getElementById(`bet-${id}`).disabled = true;
        document.getElementById(`ro-type-${id}`).disabled = true;
        document.getElementById(`ro-target-select-${id}`).disabled = true;
        document.getElementById(`ro-target-number-${id}`).disabled = true;
        document.getElementById(`msg-${id}`).innerText = "🎰 황동 휠 회전 중... 볼 낙하 추적 중";
        document.getElementById(`msg-${id}`).className = 'msg-line';
        document.getElementById(`calc-${id}`).innerText = "";

        const winningIndex = Math.floor(Math.random() * rouletteNumbers.length);
        const winningNumber = rouletteNumbers[winningIndex];

        const degreesPerSlot = 360 / rouletteNumbers.length;
        state.currentRotation += 1800 + (winningIndex * degreesPerSlot);

        const wheel = document.getElementById(`wheel-canvas-${id}`);
        wheel.style.transform = `rotate(-${state.currentRotation}deg)`;

        setTimeout(() => {
            roEvaluateResult(id, winningNumber, type, prediction);
        }, 3300);
    }

    function roEvaluateResult(id, winNum, type, pred) {
        const state = tableStates[id];
        document.getElementById(`bet-${id}`).disabled = false;
        document.getElementById(`ro-type-${id}`).disabled = false;
        document.getElementById(`ro-target-select-${id}`).disabled = false;
        document.getElementById(`ro-target-number-${id}`).disabled = false;
        roRenderControls(id, 'ready');

        const isRed = redNumbers.includes(winNum);
        let winColor = winNum === 0 ? "Green" : (isRed ? "Red" : "Black");
        let winColorEmoji = winNum === 0 ? "🟢" : (isRed ? "🔴" : "⚫");
        let isOdd = winNum % 2 !== 0;
        let winOeStr = winNum === 0 ? "None" : (isOdd ? "Odd" : "Even");

        let msg = document.getElementById(`msg-${id}`);
        let calc = document.getElementById(`calc-${id}`);
        msg.innerText = `🎯 볼 안착 결과: [ ${winColorEmoji} No.${winNum} (${winOeStr}) ]`;

        let isWin = false;
        let lossFactor = 5; 

        if (type === 'color') {
            isWin = (pred === 'red' && winColor === 'Red') || (pred === 'black' && winColor === 'Black');
        } else if (type === 'oe') {
            isWin = (winNum !== 0) && ((pred === 'odd' && isOdd) || (pred === 'even' && !isOdd));
        } else if (type === 'number') {
            isWin = (parseInt(pred) === winNum);
            lossFactor = 10; 
        }

        if (isWin) {
            let payoutFactor = (type === 'number') ? 10 : 2;
            msg.className = 'msg-line win-text';
            calc.innerText = `📈 CHIPS 정산 완료 (+${state.currentBet * payoutFactor} CHIPS)`;
            calc.className = 'calc-line win-text';
        } else {
            msg.className = 'msg-line lose-text';
            calc.innerText = `📉 CHIPS 정산 완료 (-${state.currentBet * lossFactor} CHIPS)`;
            calc.className = 'calc-line lose-text';
        }
    }
