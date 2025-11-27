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
                        content: `I'm a software engineer specializing in web development, with a focus on building efficient and scalable solutions. My expertise spans across search technologies, API development, and high-performance applications.

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
                        content: `OS: DavideOS v1.2.0 (Web-based)
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
                    'rps': { type: 'executable', run: startRPSGame }
                }
            }
        }
    };

    let currentPath = []; // Array of folder names, empty = root
    let currentDir = fileSystem; // Pointer to current directory object
    let sudoUnlocked = false; // Track if secret has been unlocked

    // --- State Management ---
    let history = JSON.parse(localStorage.getItem('terminal_history')) || [];
    let historyIndex = history.length;
    let activeGame = null; // Function to handle input if game is active

    // Load saved theme
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme) setTheme(savedTheme);

    // Check if secret was already unlocked
    const secretUnlocked = localStorage.getItem('secret_unlocked');
    if (secretUnlocked === 'true') {
        unlockSecret();
    }

    // --- Initial Greeting ---
    printOutput(`Welcome to Davide Santangelo's Terminal v1.2.0
Type 'help' to see available commands.
`);
    updatePrompt();

    // --- Input Handling ---
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const commandLine = input.value.trim();
            
            if (activeGame) {
                // Route input to active game
                printOutput(`<span class="prompt">game></span> ${commandLine}`);
                activeGame(commandLine);
            } else {
                // Standard shell
                if (commandLine) {
                    history.push(commandLine);
                    localStorage.setItem('terminal_history', JSON.stringify(history));
                    historyIndex = history.length;
                    printOutput(`<span class="prompt">${getPromptString()}</span> ${commandLine}`);
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

    function getPromptString() {
        const pathStr = currentPath.length === 0 ? '~' : '~/' + currentPath.join('/');
        return `guest@davidesantangelo.com:${pathStr}$`;
    }

    function updatePrompt() {
        if (promptSpan) promptSpan.textContent = getPromptString();
    }

    function executeCommand(commandLine) {
        const parts = commandLine.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

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

    // --- Commands ---
    const commands = {
        'help': 'Available commands: help, ls, cd [dir], cat [file], clear, whoami, date, open [url], sudo, theme [color], history, reboot, reset, pwd, socials, matrix',
        'ls': () => {
            const items = Object.keys(currentDir.children).map(name => {
                const item = currentDir.children[name];
                return item.type === 'dir' ? name + '/' : name;
            });
            return items.join('  ');
        },
        'cd': (path) => {
            if (!path || path === '~' || path === '/') {
                currentPath = [];
                currentDir = fileSystem;
                updatePrompt();
                return '';
            }
            if (path === '..') {
                if (currentPath.length > 0) {
                    currentPath.pop();
                    // Re-traverse from root
                    currentDir = fileSystem;
                    for (const p of currentPath) {
                        currentDir = currentDir.children[p];
                    }
                    updatePrompt();
                }
                return '';
            }
            
            // Simple relative path support (one level)
            if (currentDir.children[path] && currentDir.children[path].type === 'dir') {
                currentPath.push(path);
                currentDir = currentDir.children[path];
                updatePrompt();
                return '';
            }
            return `cd: ${path}: No such file or directory`;
        },
        'cat': (filename) => {
            if (!filename) return 'Usage: cat [filename]';
            const item = currentDir.children[filename];
            if (item) {
                if (item.type === 'file') return item.content;
                if (item.type === 'dir') return `cat: ${filename}: Is a directory`;
                if (item.type === 'executable') return `cat: ${filename}: Is a binary file`;
            }
            return `cat: ${filename}: No such file or directory`;
        },
        'pwd': () => '/' + currentPath.join('/'),
        'whoami': 'guest@davidesantangelo.com',
        'date': () => new Date().toString(),
        'clear': () => {
            output.innerHTML = '';
            return '';
        },
        'socials': () => {
            return `Connect with me:
- LinkedIn: https://www.linkedin.com/in/davidesantangelo/
- GitHub: https://github.com/davidesantangelo
- X: https://x.com/daviducolo
- Dev.to: https://dev.to/daviducolo`;
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
        const lastPart = parts[parts.length - 1];
        
        // Combine commands and current directory items
        const available = [
            ...Object.keys(commands),
            ...Object.keys(currentDir.children)
        ];

        const matches = available.filter(item => item.startsWith(lastPart));
        
        if (matches.length === 1) {
            // If it's the first part, it's a command or executable
            if (parts.length === 1) {
                input.value = matches[0] + ' ';
            } else {
                parts[parts.length - 1] = matches[0];
                input.value = parts.join(' ');
            }
        } else if (matches.length > 1) {
            printOutput(`<span class="prompt">${getPromptString()}</span> ${currentInput}`);
            printOutput(matches.join('  '));
        }
    }

    function startMatrixEffect() {
        const canvas = document.createElement('canvas');
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '1000';
        canvas.style.background = 'black';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = letters.charAt(Math.floor(Math.random() * letters.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        const interval = setInterval(draw, 33);

        const stopMatrix = (e) => {
            clearInterval(interval);
            document.body.removeChild(canvas);
            document.removeEventListener('keydown', stopMatrix);
            document.removeEventListener('click', stopMatrix);
            input.focus();
        };

        document.addEventListener('keydown', stopMatrix);
        document.addEventListener('click', stopMatrix);
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

    // Focus input on click
    document.addEventListener('click', () => {
        input.focus();
    });
});
