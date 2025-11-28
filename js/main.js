document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    const terminal = document.querySelector('.terminal');
    const promptSpan = document.querySelector('.prompt');

    // --- Virtual File System ---
    const fileSystem = {
        type: 'dir',
        children: {
            'about': {
                type: 'dir',
                children: {
                    'bio.txt': { 
                        type: 'file', 
                        content: `Name: Davide Santangelo

I'm a software engineer specializing in web development, with a focus on building efficient and scalable solutions. My expertise spans across search technologies, API development, and high-performance applications.

I've worked across various environments from startups to enterprise companies, gaining experience with different technologies and methodologies. This diverse background has helped me develop strong problem-solving skills and adaptability to new challenges.` 
                    },
                    'experience.txt': {
                        type: 'file',
                        content: `WORK EXPERIENCE:

2022 - Present: Software Engineer @Sevio https://sevio.it
- Developing scalable web applications and backend systems.
- Focusing on search technologies and API development.
- Working with Ruby, Go, and modern web technologies.

Previous Experience:
- Gained experience across various environments from startups to enterprise companies.
- Built high-performance applications and optimized system-level solutions.
- Expertise in REST APIs, Search Engines, and Networking.`
                    },
                    'contacts.txt': {
                        type: 'file',
                        content: `Connect with me:
- LinkedIn: https://www.linkedin.com/in/davidesantangelo/
- GitHub: https://github.com/davidesantangelo
- X: https://x.com/daviducolo
- Dev.to: https://dev.to/daviducolo`
                    }
                }
            },
            'skills': {
                type: 'dir',
                children: {
                    'languages.txt': {
                        type: 'file',
                        content: `PROGRAMMING LANGUAGES:

- Ruby (Expert)
- C (Advanced)
- Python (Intermediate)
- JavaScript (Intermediate)
- Go (Intermediate)
- SQL (Advanced)`
                    },
                    'tools.txt': {
                        type: 'file',
                        content: `TOOLS & FRAMEWORKS:

- Ruby on Rails
- PostgreSQL / MongoDB
- Git
- Redis
- Search Engines (Elasticsearch/Solr)
- REST APIs`
                    }
                }
            },
            'projects': {
                type: 'dir',
                children: {
                    'list.txt': { 
                        type: 'file', 
                        content: `Check out my work on GitHub: https://github.com/davidesantangelo

FEATURED PROJECTS:

1. dato.rss
   - The best RSS Search experience you can find
   - Ruby
   - https://github.com/davidesantangelo/dato.rss

2. krep
   - Fast text search tool with advanced algorithms, SIMD acceleration, multi-threading, and regex support
   - C
   - https://github.com/davidesantangelo/krep

3. gitingest
   - Command-line tool that fetches files from a GitHub repository and generates a consolidated text prompt for LLMs
   - Ruby
   - https://github.com/davidesantangelo/gitingest

4. lanet
   - Lightweight tool for secure and easy peer-to-peer communication on local area networks
   - Ruby
   - https://github.com/davidesantangelo/lanet

5. fastrace
   - A fast, dependency-free traceroute implementation in pure C
   - C
   - https://github.com/davidesantangelo/fastrace

6. vsort
   - Lightning-fast sorting library that harnesses Apple Silicon architecture
   - C
   - https://github.com/davidesantangelo/vsort` 
                    }
                }
            },
            'system': {
                type: 'dir',
                children: {
                    'os_info.txt': {
                        type: 'file',
                        content: `OS: DavideOS v1.0.0 (Web-based)
Kernel: JavaScript V8
Uptime: ${Math.floor(Math.random() * 10000)} seconds
Shell: Bash (simulated)`
                    },
                    'logs.txt': {
                        type: 'file',
                        content: `[SYSTEM] Boot sequence initiated...
[SYSTEM] Loading kernel modules... OK
[SYSTEM] Mounting virtual file system... OK
[SYSTEM] Starting user session... OK
[auth] User 'guest' logged in from ${navigator.userAgent}
[warn] Low coffee levels detected. Refill recommended.`
                    }
                }
            },
            'games': {
                type: 'dir',
                children: {
                    'guess': { type: 'executable', run: startGuessGame },
                    'rps': { type: 'executable', run: startRPSGame },
                    'tictactoe': { type: 'executable', run: startTicTacToe }
                }
            }
        }
    };

    let currentPath = []; // Array of folder names, empty = root
    let currentDir = fileSystem; // Pointer to current directory object
    let sudoUnlocked = false; // Track if secret has been unlocked

    // --- State Management ---
    const MAX_HISTORY_SIZE = 100;
    let history = JSON.parse(localStorage.getItem('terminal_history')) || [];
    // Trim history if it exceeds max size
    if (history.length > MAX_HISTORY_SIZE) {
        history = history.slice(-MAX_HISTORY_SIZE);
        localStorage.setItem('terminal_history', JSON.stringify(history));
    }
    let historyIndex = history.length;
    let activeGame = null; // Function to handle input if game is active
    const sessionStartTime = Date.now();

    // Load saved theme
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme) setTheme(savedTheme);

    // Check if secret was already unlocked
    const secretUnlocked = localStorage.getItem('secret_unlocked');
    if (secretUnlocked === 'true') {
        unlockSecret();
    }

    // --- Initial Greeting ---
    printOutput(`Welcome to Davide Santangelo's Terminal v1.0.0
Type 'help' to see available commands or 'web' to switch to the web version.
`);
    updatePrompt();

    // --- Input Handling ---
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const commandLine = input.value.trim();
            
            if (activeGame) {
                // Route input to active game
                printOutput(`<span class="prompt">game></span> ${escapeHtml(commandLine)}`);
                activeGame(commandLine);
            } else {
                // Standard shell
                if (commandLine) {
                    history.push(commandLine);
                    localStorage.setItem('terminal_history', JSON.stringify(history));
                    historyIndex = history.length;
                    printOutput(`<span class="prompt">${getPromptString()}</span> ${escapeHtml(commandLine)}`);
                    executeCommand(commandLine);
                } else {
                    printOutput(`<span class="prompt">${getPromptString()}</span>`);
                }
            }
            
            input.value = '';
            scrollToBottom();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = history[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < history.length - 1) {
                historyIndex++;
                input.value = history[historyIndex];
            } else {
                historyIndex = history.length;
                input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            if (!activeGame) handleTabCompletion(input.value);
        }
    });

    // --- Core Functions ---

    function unlockSecret() {
        if (sudoUnlocked) return;
        
        sudoUnlocked = true;
        localStorage.setItem('secret_unlocked', 'true');
        
        // Add secret directory to filesystem
        fileSystem.children['.secret'] = {
            type: 'dir',
            children: {
                'message.txt': {
                    type: 'file',
                    content: `🎉 CONGRATULATIONS! 🎉

You've unlocked the secret directory!

"The best way to predict the future is to invent it." - Alan Kay

Thank you for exploring my terminal portfolio.
If you've made it this far, you're clearly someone who appreciates
attention to detail and enjoys discovering hidden gems.

Let's connect! I'm always interested in meeting fellow curious minds.

- Davide

P.S. There might be more secrets... keep exploring! 😉`
                },
                'achievements.txt': {
                    type: 'file',
                    content: `🏆 ACHIEVEMENTS UNLOCKED:

[✓] Terminal Explorer - You found the hidden directory
[✓] Sudo Master - You cracked the password
[✓] Curiosity - You didn't stop at the first "Permission denied"

Keep exploring to unlock more achievements!`
                },
                'contact_davide.txt': {
                    type: 'file',
                    content: `Want to get in touch directly?

Email: Check my GitHub profile for email
LinkedIn: https://www.linkedin.com/in/davidesantangelo/
GitHub: https://github.com/davidesantangelo

I'm always open to interesting conversations about:
- Software Engineering
- Search Technologies
- System Architecture
- Open Source Projects`
                }
            }
        };
    }

    function getAbsolutePath(path) {
        if (path === '~') return [];
        if (path.startsWith('~/')) {
            path = path.substring(2);
            return path.split('/').filter(p => p !== '');
        }
        
        const parts = path.split('/').filter(p => p !== '');
        let stack = path.startsWith('/') ? [] : [...currentPath];
        
        for (const part of parts) {
            if (part === '.') continue;
            if (part === '..') {
                if (stack.length > 0) stack.pop();
            } else {
                stack.push(part);
            }
        }
        return stack;
    }

    function getItem(path) {
        if (!path) return null;
        if (path === '/') return fileSystem;
        
        const absolutePath = getAbsolutePath(path);
        let item = fileSystem;
        
        for (const part of absolutePath) {
            if (item.type !== 'dir' || !item.children[part]) {
                return null;
            }
            item = item.children[part];
        }
        return item;
    }

    function getPromptString() {
        const pathStr = currentPath.length === 0 ? '~' : '~/' + currentPath.join('/');
        return `guest@davidesantangelo.com:${pathStr}$`;
    }

    function updatePrompt() {
        if (promptSpan) promptSpan.textContent = getPromptString();
    }

    function executeCommand(commandLine) {
        const parts = commandLine.split(' ');
        let cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Check for aliases
        if (aliases[cmd]) {
            cmd = aliases[cmd];
        }

        if (commands[cmd]) {
            let result;
            if (typeof commands[cmd] === 'function') {
                result = commands[cmd](...args);
            } else {
                result = commands[cmd];
            }
            if (result) printOutput(result);
        } else {
            // Check if it's an executable in the current directory
            if (currentDir.children[cmd] && currentDir.children[cmd].type === 'executable') {
                currentDir.children[cmd].run();
            } else {
                printOutput(`bash: ${cmd}: command not found`);
            }
        }
    }

    // --- Command Aliases ---
    const aliases = {
        'll': 'ls',
        'dir': 'ls',
        'exit': 'reboot',
        'quit': 'reboot',
        'cls': 'clear'
    };

    // --- Commands ---
    const commands = {
        'help': `
  <span class="directory">Navigation</span>
    ls            List directory contents
    cd [dir]      Change directory
    pwd           Print working directory
    cat [file]    Display file contents
    grep [t] [f]  Search text in file

  <span class="directory">System</span>
    whoami        Display current user
    date          Show current date/time
    uptime        Show session uptime
    neofetch      Display system info
    clear         Clear terminal screen

  <span class="directory">Utilities</span>
    echo [text]   Print text to terminal
    open [url]    Open URL in browser
    history       Show command history
    theme [color] Set theme (green|amber|blue|white)

  <span class="directory">Fun</span>
    matrix        Enter the Matrix
    sudo          Elevate privileges

  <span class="directory">View</span>
    web           Switch to minimal web version

  <span class="directory">Session</span>
    reboot        Reload terminal
    reset         Factory reset

  <span class="info">Tip:</span> TAB to autocomplete, ↑↓ for history`,
        'ls': (dir) => {
            let target = currentDir;
            if (dir) {
                const item = getItem(dir);
                if (!item) return `ls: ${dir}: No such file or directory`;
                if (item.type !== 'dir') return `ls: ${dir}: Not a directory`;
                target = item;
            }
            
            const items = Object.keys(target.children).map(name => {
                const item = target.children[name];
                if (item.type === 'dir') {
                    return `<span class="directory">${name}/</span>`;
                } else if (item.type === 'executable') {
                    return `<span class="executable">${name}</span>`;
                } else {
                    return name;
                }
            });
            return items.join('  ');
        },
        'cd': (path) => {
            if (!path || path === '~') {
                currentPath = [];
                currentDir = fileSystem;
                updatePrompt();
                return '';
            }
            
            const item = getItem(path);
            
            if (!item) {
                return `cd: ${path}: No such file or directory`;
            }
            
            if (item.type !== 'dir') {
                return `cd: ${path}: Not a directory`;
            }
            
            currentDir = item;
            currentPath = getAbsolutePath(path);
            updatePrompt();
            return '';
        },
        'cat': (filename) => {
            if (!filename) return 'Usage: cat [filename]';
            const item = getItem(filename);
            if (item) {
                if (item.type === 'file') return item.content;
                if (item.type === 'dir') return `cat: ${filename}: Is a directory`;
                if (item.type === 'executable') return `cat: ${filename}: Is a binary file`;
            }
            return `cat: ${filename}: No such file or directory`;
        },
        'grep': (term, filename) => {
            if (!term) return 'Usage: grep [term] [filename]';
            if (!filename) return 'Usage: grep [term] [filename]';
            
            const item = getItem(filename);
            
            if (!item) {
                return `grep: ${filename}: No such file or directory`;
            }
            
            if (item.type === 'dir') {
                return `grep: ${filename}: Is a directory`;
            }
            
            if (item.type === 'executable') {
                return `grep: ${filename}: Binary file matches`;
            }
            
            const lines = item.content.split('\n');
            const matches = [];
            
            lines.forEach((line, idx) => {
                if (line.includes(term)) {
                    matches.push({ line, lineNumber: idx + 1 });
                }
            });
            
            if (matches.length === 0) {
                return '';
            }
            
            return matches.map(({ line, lineNumber }) => {
                let formattedLine = '';
                let currentIndex = 0;
                let matchIndex = line.indexOf(term, currentIndex);
                
                while (matchIndex !== -1) {
                    // Text before match
                    formattedLine += escapeHtml(line.substring(currentIndex, matchIndex));
                    
                    // Match
                    formattedLine += `<span style="color: #111; background-color: var(--text-color); font-weight: bold;">${escapeHtml(term)}</span>`;
                    
                    currentIndex = matchIndex + term.length;
                    matchIndex = line.indexOf(term, currentIndex);
                }
                
                // Remaining text
                formattedLine += escapeHtml(line.substring(currentIndex));
                
                return `<span style="opacity: 0.5; margin-right: 10px;">${lineNumber}</span>${formattedLine}`;
            }).join('\n');
        },
        'pwd': () => '/' + currentPath.join('/'),
        'whoami': 'guest@davidesantangelo.com',
        'date': () => new Date().toString(),
        'clear': () => {
            output.innerHTML = '';
            return '';
        },
        'echo': (...args) => {
            return escapeHtml(args.join(' '));
        },
        'uptime': () => {
            const uptime = Date.now() - sessionStartTime;
            return `Session uptime: ${formatUptime(uptime)}`;
        },
        'neofetch': () => {
            const uptime = formatUptime(Date.now() - sessionStartTime);
            const theme = localStorage.getItem('terminal_theme') || 'green';
            const cores = navigator.hardwareConcurrency || '?';
            const memory = navigator.deviceMemory ? navigator.deviceMemory + ' GB' : 'N/A';
            return `
<span class="directory">guest</span>@<span class="executable">davidesantangelo.com</span>
────────────────────────────
<span class="directory">OS</span>       DavideOS v1.0.0
<span class="directory">Host</span>     Web Browser
<span class="directory">Kernel</span>   JavaScript ES2024
<span class="directory">Uptime</span>   ${uptime}
<span class="directory">Shell</span>    bash 5.0
<span class="directory">Theme</span>    ${theme}
<span class="directory">Terminal</span> 80x24
<span class="directory">CPU</span>      ${cores} cores
<span class="directory">Memory</span>   ${memory}
`;
        },
        'open': (url) => {
            if (!url) return 'Usage: open [url]';
            if (!url.startsWith('http')) url = 'https://' + url;
            window.open(url, '_blank');
            return `Opening ${url}...`;
        },
        'sudo': (...args) => {
            const password = args.join(' ');
            
            // Secret password is the user's name
            if (password === 'davidesantangelo' || password === 'davide') {
                if (!sudoUnlocked) {
                    unlockSecret();
                    return `[sudo] password accepted. Access granted.

🔓 Secret directory unlocked!
Type 'ls' to see the new '.secret' directory.
Type 'cd .secret' to explore it.`;
                } else {
                    return '[sudo] Access already granted. Check the .secret directory.';
                }
            }
            
            // Give hints based on attempts
            const hints = [
                'Permission denied: you are not Davide.\n💡 Hint: Maybe try using sudo with... my name?',
                'Permission denied: you are not Davide.\n💡 Hint: The password might be my first name...',
                'Permission denied: you are not Davide.\n💡 Hint: Or perhaps my full name? (no spaces)'
            ];
            
            const attemptCount = parseInt(localStorage.getItem('sudo_attempts') || '0');
            localStorage.setItem('sudo_attempts', (attemptCount + 1).toString());
            
            const hintIndex = Math.min(attemptCount, hints.length - 1);
            return hints[hintIndex];
        },
        'reboot': () => {
            setTimeout(() => location.reload(), 1000);
            return 'Rebooting system...';
        },
        'reset': () => {
            if (confirm('This will reset the terminal to its original state.\nYou will lose:\n- Command history\n- Theme settings\n- Unlocked secrets\n\nAre you sure?')) {
                localStorage.clear();
                setTimeout(() => location.reload(), 500);
                return 'Resetting system to factory defaults...';
            }
            return 'Reset cancelled.';
        },
        'history': () => history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n'),
        'theme': (color) => {
            if (setTheme(color)) {
                return `Theme set to ${color.charAt(0).toUpperCase() + color.slice(1)}.`;
            } else {
                return 'Usage: theme [green|amber|blue|white]';
            }
        },
        'matrix': () => {
            startMatrixEffect();
            return 'Follow the white rabbit... (Press any key to exit)';
        },
        'web': () => {
            setTimeout(() => {
                window.location.href = 'web.html';
            }, 500);
            return 'Switching to minimal web version...';
        }
    };

    // --- Games ---

    function startGuessGame() {
        activeGame = handleGuessInput;
        printOutput(`
=== GUESS THE NUMBER ===
I'm thinking of a number between 1 and 100.
Type 'exit' to quit.
`);
        gameState = {
            target: Math.floor(Math.random() * 100) + 1,
            attempts: 0
        };
    }

    let gameState = {};

    function handleGuessInput(input) {
        if (input.toLowerCase() === 'exit') {
            activeGame = null;
            printOutput('Game over. Bye!');
            return;
        }

        const guess = parseInt(input);
        if (isNaN(guess)) {
            printOutput('Please enter a valid number.');
            return;
        }

        gameState.attempts++;

        if (guess < gameState.target) {
            printOutput('Too low!');
        } else if (guess > gameState.target) {
            printOutput('Too high!');
        } else {
            printOutput(`CORRECT! You guessed it in ${gameState.attempts} attempts.`);
            activeGame = null;
        }
    }

    function startRPSGame() {
        activeGame = handleRPSInput;
        printOutput(`
=== ROCK PAPER SCISSORS ===
Type 'rock', 'paper', or 'scissors'.
Type 'exit' to quit.
`);
    }

    function handleRPSInput(input) {
        const choice = input.toLowerCase();
        if (choice === 'exit') {
            activeGame = null;
            printOutput('Game over.');
            return;
        }

        const validChoices = ['rock', 'paper', 'scissors'];
        if (!validChoices.includes(choice)) {
            printOutput('Invalid choice. Try rock, paper, or scissors.');
            return;
        }

        const cpuChoice = validChoices[Math.floor(Math.random() * validChoices.length)];
        printOutput(`CPU chose: ${cpuChoice}`);

        if (choice === cpuChoice) {
            printOutput('It\'s a tie!');
        } else if (
            (choice === 'rock' && cpuChoice === 'scissors') ||
            (choice === 'paper' && cpuChoice === 'rock') ||
            (choice === 'scissors' && cpuChoice === 'paper')
        ) {
            printOutput('You win!');
        } else {
            printOutput('You lose!');
        }
        
        printOutput('Play again? (rock/paper/scissors/exit)');
    }

    function startTicTacToe() {
        printOutput('Launching Tic-Tac-Toe with graphical interface...');
        
        // Create popup overlay
        const overlay = document.createElement('div');
        overlay.className = 'game-overlay';
        
        // Create game container
        const gameContainer = document.createElement('div');
        gameContainer.className = 'tictactoe-container';
        
        // Game state
        let board = ['', '', '', '', '', '', '', '', ''];
        let currentPlayer = 'X';
        let gameOver = false;
        let scores = { X: 0, O: 0, ties: 0 };
        
        // Create header
        const header = document.createElement('div');
        header.className = 'ttt-header';
        header.innerHTML = `
            <h2>TIC-TAC-TOE</h2>
            <div class="ttt-turn">Your turn (X)</div>
        `;
        
        // Create grid
        const grid = document.createElement('div');
        grid.className = 'ttt-grid';
        
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'ttt-cell';
            cell.dataset.index = i;
            cell.addEventListener('click', () => handleCellClick(i));
            grid.appendChild(cell);
        }
        
        // Create footer with scores and controls
        const footer = document.createElement('div');
        footer.className = 'ttt-footer';
        footer.innerHTML = `
            <div class="ttt-scores">
                <div>You (X): <span id="score-x">0</span></div>
                <div>CPU (O): <span id="score-o">0</span></div>
                <div>Ties: <span id="score-ties">0</span></div>
            </div>
            <div class="ttt-controls">
                <button class="ttt-btn ttt-btn-reset">New Game</button>
                <button class="ttt-btn ttt-btn-close">Close</button>
            </div>
        `;
        
        gameContainer.appendChild(header);
        gameContainer.appendChild(grid);
        gameContainer.appendChild(footer);
        overlay.appendChild(gameContainer);
        document.body.appendChild(overlay);
        
        // Event listeners
        footer.querySelector('.ttt-btn-reset').addEventListener('click', resetGame);
        footer.querySelector('.ttt-btn-close').addEventListener('click', closeGame);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeGame();
        });
        
        function handleCellClick(index) {
            if (board[index] !== '' || gameOver || currentPlayer !== 'X') return;
            
            makeMove(index, 'X');
            
            if (!gameOver) {
                currentPlayer = 'O';
                updateTurnDisplay();
                // CPU move after a short delay
                setTimeout(() => {
                    if (!gameOver) {
                        const cpuMove = getBestMove();
                        makeMove(cpuMove, 'O');
                        currentPlayer = 'X';
                        updateTurnDisplay();
                    }
                }, 500);
            }
        }
        
        function makeMove(index, player) {
            board[index] = player;
            const cell = grid.children[index];
            cell.textContent = player;
            cell.classList.add('filled', `player-${player.toLowerCase()}`);
            
            const winner = checkWinner();
            if (winner) {
                gameOver = true;
                if (winner === 'tie') {
                    scores.ties++;
                    document.getElementById('score-ties').textContent = scores.ties;
                    header.querySelector('.ttt-turn').textContent = "It's a tie!";
                    header.querySelector('.ttt-turn').style.color = '#ffff00';
                } else {
                    scores[winner]++;
                    document.getElementById(`score-${winner.toLowerCase()}`).textContent = scores[winner];
                    const winnerName = winner === 'X' ? 'You win!' : 'CPU wins!';
                    header.querySelector('.ttt-turn').textContent = winnerName;
                    header.querySelector('.ttt-turn').style.color = winner === 'X' ? '#00ff88' : '#ff5555';
                    highlightWinningCells();
                }
            }
        }
        
        function checkWinner() {
            const lines = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                [0, 4, 8], [2, 4, 6] // diagonals
            ];
            
            for (const [a, b, c] of lines) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    return board[a];
                }
            }
            
            if (board.every(cell => cell !== '')) {
                return 'tie';
            }
            
            return null;
        }
        
        function highlightWinningCells() {
            const lines = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            
            for (const [a, b, c] of lines) {
                if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                    grid.children[a].classList.add('winning-cell');
                    grid.children[b].classList.add('winning-cell');
                    grid.children[c].classList.add('winning-cell');
                    break;
                }
            }
        }
        
        function getBestMove() {
            // Simple AI: try to win, block player, or take center/corner
            const lines = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            
            // Try to win
            for (const [a, b, c] of lines) {
                if (board[a] === 'O' && board[b] === 'O' && board[c] === '') return c;
                if (board[a] === 'O' && board[c] === 'O' && board[b] === '') return b;
                if (board[b] === 'O' && board[c] === 'O' && board[a] === '') return a;
            }
            
            // Block player
            for (const [a, b, c] of lines) {
                if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
                if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
                if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
            }
            
            // Take center
            if (board[4] === '') return 4;
            
            // Take corners
            const corners = [0, 2, 6, 8];
            const availableCorners = corners.filter(i => board[i] === '');
            if (availableCorners.length > 0) {
                return availableCorners[Math.floor(Math.random() * availableCorners.length)];
            }
            
            // Take any available
            const available = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
            return available[Math.floor(Math.random() * available.length)];
        }
        
        function updateTurnDisplay() {
            const turnDisplay = header.querySelector('.ttt-turn');
            if (!gameOver) {
                turnDisplay.textContent = currentPlayer === 'X' ? 'Your turn (X)' : 'CPU thinking...';
                turnDisplay.style.color = 'var(--text-color)';
            }
        }
        
        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameOver = false;
            
            Array.from(grid.children).forEach(cell => {
                cell.textContent = '';
                cell.className = 'ttt-cell';
            });
            
            updateTurnDisplay();
        }
        
        function closeGame() {
            document.body.removeChild(overlay);
            input.focus();
        }
    }

    // --- Helpers ---

    function setTheme(color) {
        const root = document.documentElement;
        switch(color) {
            case 'amber':
                root.style.setProperty('--text-color', '#ffb000');
                root.style.setProperty('--text-shadow', '0 0 2px rgba(255, 176, 0, 0.4)');
                break;
            case 'green':
                root.style.setProperty('--text-color', '#33ff00');
                root.style.setProperty('--text-shadow', '0 0 2px rgba(51, 255, 0, 0.4)');
                break;
            case 'blue':
                root.style.setProperty('--text-color', '#00ccff');
                root.style.setProperty('--text-shadow', '0 0 2px rgba(0, 204, 255, 0.4)');
                break;
            case 'white':
                root.style.setProperty('--text-color', '#ffffff');
                root.style.setProperty('--text-shadow', '0 0 2px rgba(255, 255, 255, 0.4)');
                break;
            default:
                return false;
        }
        localStorage.setItem('terminal_theme', color);
        return true;
    }

    function handleTabCompletion(currentInput) {
        const parts = currentInput.split(' ');
        
        if (!currentInput.trim()) return;

        if (parts.length === 1) {
            const cmd = parts[0];
            const available = [
                ...Object.keys(commands),
                ...Object.keys(currentDir.children)
            ];
            const matches = available.filter(c => c.startsWith(cmd));
            
            if (matches.length === 1) {
                let completion = matches[0];
                if (currentDir.children[completion] && currentDir.children[completion].type === 'dir') {
                    completion += '/';
                } else {
                    completion += ' ';
                }
                input.value = completion;
            } else if (matches.length > 1) {
                printOutput(`<span class="prompt">${getPromptString()}</span> ${currentInput}`);
                printOutput(matches.join('  '));
            }
        } else {
            const lastArg = parts[parts.length - 1];
            let dirPath = '';
            let searchTerm = lastArg;
            
            const lastSlash = lastArg.lastIndexOf('/');
            if (lastSlash !== -1) {
                dirPath = lastArg.substring(0, lastSlash + 1);
                searchTerm = lastArg.substring(lastSlash + 1);
            }
            
            let targetDir = dirPath ? getItem(dirPath) : currentDir;
            
            if (targetDir && targetDir.type === 'dir') {
                const candidates = Object.keys(targetDir.children);
                const matches = candidates.filter(c => c.startsWith(searchTerm));
                
                if (matches.length === 1) {
                    const match = matches[0];
                    const item = targetDir.children[match];
                    const suffix = item.type === 'dir' ? '/' : '';
                    
                    parts[parts.length - 1] = dirPath + match + suffix;
                    input.value = parts.join(' ');
                } else if (matches.length > 1) {
                    printOutput(`<span class="prompt">${getPromptString()}</span> ${currentInput}`);
                    printOutput(matches.map(m => {
                        const item = targetDir.children[m];
                        return item.type === 'dir' ? m + '/' : m;
                    }).join('  '));
                }
            }
        }
    }

    function startMatrixEffect() {
        // Blur input to prevent key capture issues
        input.blur();
        
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1000';
        canvas.style.background = 'black';
        canvas.style.cursor = 'pointer';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
        const fontSize = 16;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = Math.floor(Math.random() * -100); // Staggered start
        }

        let animationId = null;
        let isRunning = true;

        function draw() {
            if (!isRunning) return;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                if (drops[i] > 0) {
                    const text = letters.charAt(Math.floor(Math.random() * letters.length));
                    ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                }

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            
            animationId = requestAnimationFrame(draw);
        }

        // Start animation
        animationId = requestAnimationFrame(draw);

        // Handle window resize with debounce
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }, 100);
        };
        window.addEventListener('resize', handleResize);

        const stopMatrix = (e) => {
            if (!isRunning) return;
            isRunning = false;
            
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
            
            if (canvas.parentNode) {
                document.body.removeChild(canvas);
            }
            
            // Clean up all event listeners
            document.removeEventListener('keydown', stopMatrix, true);
            document.removeEventListener('click', stopMatrix, true);
            canvas.removeEventListener('click', stopMatrix);
            window.removeEventListener('resize', handleResize);
            clearTimeout(resizeTimeout);
            
            // Restore focus to input
            setTimeout(() => input.focus(), 100);
        };

        // Use capture phase to catch events before other handlers
        document.addEventListener('keydown', stopMatrix, true);
        document.addEventListener('click', stopMatrix, true);
        canvas.addEventListener('click', stopMatrix);
    }

    function printOutput(text) {
        const div = document.createElement('div');
        div.className = 'command-output';
        // Convert URLs to clickable links
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const formattedText = text.replace(urlRegex, '<a href="$1" target="_blank">$1</a>');
        div.innerHTML = formattedText.replace(/\n/g, '<br>');
        output.appendChild(div);
        scrollToBottom();
    }

    function scrollToBottom() {
        terminal.scrollTop = terminal.scrollHeight;
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Format uptime
    function formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }

    // Focus input on click
    document.addEventListener('click', () => {
        input.focus();
    });
});
