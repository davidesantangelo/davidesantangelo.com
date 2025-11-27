document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('command-input');
    const output = document.getElementById('output');
    const terminal = document.querySelector('.terminal');

    // Virtual File System
    const fileSystem = {
        'about.txt': `I'm a software engineer specializing in web development, with a focus on building efficient and scalable solutions. My expertise spans across search technologies, API development, and high-performance applications.

I've worked across various environments from startups to enterprise companies, gaining experience with different technologies and methodologies. This diverse background has helped me develop strong problem-solving skills and adaptability to new challenges.`,
        'skills.txt': `TECHNICAL SKILLS:
- Ruby
- C
- Networking
- REST APIs
- Search Engines
- Python
- MongoDB
- PostgreSQL
- Git`,
        'contact.txt': `Connect with me:
- LinkedIn: https://www.linkedin.com/in/davidesantangelo/
- GitHub: https://github.com/davidesantangelo
- X: https://x.com/daviducolo
- Dev.to: https://dev.to/daviducolo`,
        'projects.txt': `Check out my work on GitHub: https://github.com/davidesantangelo`
    };

    const commands = {
        'help': 'Available commands: help, ls, cat [filename], clear, whoami, date, open [url], sudo, theme [color], history, reboot, pwd, socials',
        'ls': () => Object.keys(fileSystem).join('\n'),
        'whoami': 'guest@davidesantangelo.com',
        'date': () => new Date().toString(),
        'matrix': () => {
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
            
            return 'Follow the white rabbit... (Press any key to exit)';
        },
        'pwd': '/home/guest',
        'socials': () => {
            return `Connect with me:
- LinkedIn: https://www.linkedin.com/in/davidesantangelo/
- GitHub: https://github.com/davidesantangelo
- X: https://x.com/daviducolo
- Dev.to: https://dev.to/daviducolo`;
        },
        'clear': () => {
            output.innerHTML = '';
            return '';
        },
        'cat': (filename) => {
            if (!filename) return 'Usage: cat [filename]';
            if (fileSystem[filename]) return fileSystem[filename];
            return `cat: ${filename}: No such file or directory`;
        },
        'open': (url) => {
            if (!url) return 'Usage: open [url]';
            if (!url.startsWith('http')) url = 'https://' + url;
            window.open(url, '_blank');
            return `Opening ${url}...`;
        },
        'sudo': () => 'Permission denied: you are not Davide.',
        'reboot': () => {
            setTimeout(() => location.reload(), 1000);
            return 'Rebooting system...';
        },
        'history': () => history.map((cmd, i) => `${i + 1}  ${cmd}`).join('\n'),
        'theme': (color) => {
            const root = document.documentElement;
            switch(color) {
                case 'amber':
                    root.style.setProperty('--text-color', '#ffb000');
                    root.style.setProperty('--text-shadow', '0 0 2px rgba(255, 176, 0, 0.4)');
                    return 'Theme set to Amber.';
                case 'green':
                    root.style.setProperty('--text-color', '#33ff00');
                    root.style.setProperty('--text-shadow', '0 0 2px rgba(51, 255, 0, 0.4)');
                    return 'Theme set to Green.';
                case 'blue':
                    root.style.setProperty('--text-color', '#00ccff');
                    root.style.setProperty('--text-shadow', '0 0 2px rgba(0, 204, 255, 0.4)');
                    return 'Theme set to Blue.';
                case 'white':
                    root.style.setProperty('--text-color', '#ffffff');
                    root.style.setProperty('--text-shadow', '0 0 2px rgba(255, 255, 255, 0.4)');
                    return 'Theme set to White.';
                default:
                    return 'Usage: theme [green|amber|blue|white]';
            }
        }
    };

    // Command History
    let history = JSON.parse(localStorage.getItem('terminal_history')) || [];
    let historyIndex = history.length;

    // Load saved theme
    const savedTheme = localStorage.getItem('terminal_theme');
    if (savedTheme) {
        setTheme(savedTheme);
    }

    // Initial greeting
    printOutput(`Welcome to Davide Santangelo's Terminal v1.1.0
Type 'help' to see available commands.
`);

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const commandLine = input.value.trim();
            if (commandLine) {
                history.push(commandLine);
                localStorage.setItem('terminal_history', JSON.stringify(history));
                historyIndex = history.length;
                printOutput(`<span class="prompt">guest@davidesantangelo.com:~$</span> ${commandLine}`);
                executeCommand(commandLine);
            } else {
                printOutput(`<span class="prompt">guest@davidesantangelo.com:~$</span>`);
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
            handleTabCompletion(input.value);
        }
    });

    function handleTabCompletion(currentInput) {
        const parts = currentInput.split(' ');
        const lastPart = parts[parts.length - 1];
        
        if (parts.length === 1) {
            // Command completion
            const matches = Object.keys(commands).filter(cmd => cmd.startsWith(lastPart));
            if (matches.length === 1) {
                input.value = matches[0] + ' ';
            } else if (matches.length > 1) {
                printOutput(`<span class="prompt">guest@davidesantangelo.com:~$</span> ${currentInput}`);
                printOutput(matches.join('  '));
            }
        } else {
            // File completion (simple version)
            const matches = Object.keys(fileSystem).filter(file => file.startsWith(lastPart));
            if (matches.length === 1) {
                parts[parts.length - 1] = matches[0];
                input.value = parts.join(' ');
            } else if (matches.length > 1) {
                printOutput(`<span class="prompt">guest@davidesantangelo.com:~$</span> ${currentInput}`);
                printOutput(matches.join('  '));
            }
        }
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
            printOutput(`bash: ${cmd}: command not found`);
        }
    }

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

    // Update theme command to use helper
    commands['theme'] = (color) => {
        if (setTheme(color)) {
            return `Theme set to ${color.charAt(0).toUpperCase() + color.slice(1)}.`;
        } else {
            return 'Usage: theme [green|amber|blue|white]';
        }
    };

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
