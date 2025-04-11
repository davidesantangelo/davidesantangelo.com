/**
 * @fileoverview Initializes various UI libraries and effects for the page.
 * Includes AOS animations, Typed.js subtitles, Particles.js background,
 * smooth scrolling, scroll-triggered animations, and theme toggling.
 */

document.addEventListener('DOMContentLoaded', function () {
    // Cache frequently accessed elements
    const doc = document;
    const win = window;
    const body = doc.body;
    const docEl = doc.documentElement;
    const head = doc.head;

    /**
     * Initializes the AOS (Animate On Scroll) library.
     */
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                once: false, // Animation happens every time elements scroll into view
                mirror: true, // Elements animate out when scrolling past
                anchorPlacement: 'top-bottom', // Defines which position of the element regarding to window should trigger the animation
                easing: 'ease-out-cubic', // Custom easing for AOS animations
                duration: 800, // Duration of animation in ms
                delay: 100, // Delay on animation start in ms
                throttleDelay: 99, // Throttle scrolling events during animations
                disable: 'mobile' // Disable AOS on mobile devices
            });
            console.log("AOS initialized.");
        } else {
            console.warn("AOS library not found.");
        }
    }

    /**
     * Initializes the Typed.js library for the subtitle animation.
     */
    function initTyped() {
        if (typeof Typed !== 'undefined') {
            // Add custom CSS for typed cursor to ensure proper alignment and prevent layout shifts
            const style = doc.createElement('style');
            style.textContent = `
                .typed-cursor {
                    vertical-align: middle !important; /* Align cursor vertically */
                    position: relative !important;    /* Ensure proper positioning */
                    line-height: inherit !important; /* Inherit line height */
                    display: inline-block !important;/* Prevent breaking layout */
                    margin-left: 2px;                /* Space between text and cursor */
                }
            `;
            head.appendChild(style);

            new Typed('#typed-subtitle', {
                strings: [
                    'Building efficient and scalable solutions.',
                    'Focused on search technologies and web development.',
                    'Creating modern, high-performance applications.'
                ],
                typeSpeed: 40, // Speed of typing
                backSpeed: 20, // Speed of deleting
                backDelay: 1500, // Delay before starting to delete
                startDelay: 500, // Delay before typing starts
                loop: true, // Loop the animation
                showCursor: false, // Hide the blinking cursor
                cursorChar: '|', // Character for the cursor (though hidden)
                autoInsertCss: true // Let Typed.js inject basic CSS for the cursor
            });
            console.log("Typed.js initialized.");
        } else {
            console.warn("Typed.js library not found.");
        }
    }

    /**
     * Initializes the Particles.js library for the background effect.
     */
    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            const particlesContainerId = 'particles-js';
            const particlesElement = doc.getElementById(particlesContainerId);

            if (!particlesElement) {
                console.warn(`Element with ID '${particlesContainerId}' not found for particles.js.`);
                return;
            }

            // Helper function to get CSS variable value safely
            const getCssVariable = (varName, fallback) => {
                return getComputedStyle(docEl).getPropertyValue(varName).trim() || fallback;
            };

            const primaryColor = getCssVariable('--primary-color', '#4fd1c5');

            particlesJS(particlesContainerId, {
                particles: {
                    number: {
                        value: 80, // Number of particles
                        density: { enable: true, value_area: 800 } // Density adjustment
                    },
                    color: { value: primaryColor }, // Particle color from CSS variable
                    shape: {
                        type: "circle", // Shape of particles
                        stroke: { width: 0, color: "#000000" } // No border
                    },
                    opacity: {
                        value: 0.5, // Base opacity
                        random: true, // Randomize opacity
                        anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } // Opacity animation
                    },
                    size: {
                        value: 3, // Base size
                        random: true, // Randomize size
                        anim: { enable: false } // Size animation disabled
                    },
                    line_linked: {
                        enable: true, // Draw lines between particles
                        distance: 150, // Max distance for lines
                        color: primaryColor, // Line color from CSS variable
                        opacity: 0.4, // Line opacity
                        width: 1 // Line width
                    },
                    move: {
                        enable: true, // Particles move
                        speed: 2, // Movement speed
                        direction: "none", // Random direction
                        random: true, // Randomize initial direction
                        straight: false, // Particles move in curves
                        out_mode: "out", // Particles disappear when leaving canvas
                        bounce: false, // No bouncing off edges
                    }
                },
                interactivity: {
                    detect_on: "canvas", // Interaction detection area
                    events: {
                        onhover: { enable: true, mode: "grab" }, // Grab effect on hover
                        onclick: { enable: true, mode: "push" }, // Push effect on click
                        resize: true // Recalculate on resize
                    },
                    modes: {
                        grab: { distance: 140, line_linked: { opacity: 1 } }, // Grab mode settings
                        push: { particles_nb: 4 } // Push mode settings (adds 4 particles on click)
                    }
                },
                retina_detect: true // Enable retina display support
            });
            console.log("Particles.js initialized.");
        } else {
            console.warn("Particles.js library not found.");
        }
    }

    /**
     * Sets up smooth scrolling for anchor links.
     */
    function initSmoothScroll() {
        doc.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Ensure it's a valid internal link and not just "#"
                if (href && href.length > 1) {
                    const targetElement = doc.querySelector(href);
                    if (targetElement) {
                        e.preventDefault(); // Prevent default anchor jump

                        const targetPosition = targetElement.getBoundingClientRect().top + win.pageYOffset;
                        const startPosition = win.pageYOffset;
                        const distance = targetPosition - startPosition;
                        const duration = 800; // Duration in milliseconds
                        let startTimestamp = null;

                        // Custom easing function (ease-in-out quad)
                        const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                        // Animation frame step function
                        function step(timestamp) {
                            if (!startTimestamp) startTimestamp = timestamp;
                            const progress = timestamp - startTimestamp;
                            const easedProgress = easeInOutQuad(Math.min(progress / duration, 1));

                            win.scrollTo(0, startPosition + distance * easedProgress);

                            if (progress < duration) {
                                win.requestAnimationFrame(step);
                            }
                        }

                        win.requestAnimationFrame(step);
                    }
                }
            });
        });
        console.log("Smooth scroll initialized.");
    }

    /**
     * Sets up scroll-triggered animations for elements without AOS.
     * Uses requestAnimationFrame for performance.
     */
    function initScrollAnimations() {
        // Select sections AND footer for animations
        const scrollElements = doc.querySelectorAll('section:not([data-aos]), footer');
        if (scrollElements.length === 0) {
            console.log("No non-AOS elements found for custom scroll animations.");
            return; // No elements to animate
        }

        let ticking = false;
        const cachedWindowHeight = win.innerHeight || docEl.clientHeight;

        // Check if element is in viewport (with an offset)
        const elementInView = (el, offset = 1.25) => {
            const rect = el.getBoundingClientRect();
            // Special case for footer: check if it's close to being in view
            if (el.tagName.toLowerCase() === 'footer') {
                // Make the footer appear sooner (when it's 100px from entering viewport)
                return rect.top <= cachedWindowHeight + 100; 
            }
            // Regular check for other elements
            return rect.top <= cachedWindowHeight / offset;
        };

        // Apply styles to show the element
        const displayScrollElement = (element) => {
            element.style.opacity = "1";
            element.style.transform = "translateY(0)";
            // Ensure transition is defined (could also be done in CSS)
            element.style.transition = "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.17, 0.67, 0.43, 0.99)";
        };

        // Apply styles to hide the element initially
        const hideScrollElement = (element) => {
            element.style.opacity = "0";
            element.style.transform = "translateY(20px)";
        };

        // Initial setup: hide elements
        scrollElements.forEach(hideScrollElement);

        // Function to handle the animation logic on scroll
        const handleScrollAnimation = () => {
            scrollElements.forEach((el) => {
                // Check if element is in view and hasn't already been animated (check opacity)
                if (elementInView(el) && el.style.opacity === "0") {
                    displayScrollElement(el);
                }
                // Optional: Hide elements again when they scroll out of view (can be performance-intensive)
                // else if (!elementInView(el, 1) && el.style.opacity === "1") {
                //     hideScrollElement(el);
                // }
            });
        };

        // Debounced scroll handler using requestAnimationFrame
        const onScroll = () => {
            if (!ticking) {
                win.requestAnimationFrame(() => {
                    handleScrollAnimation();
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Add passive scroll listener for performance
        win.addEventListener('scroll', onScroll, { passive: true });

        // Trigger once on load in case elements are already in view
        handleScrollAnimation();
        console.log("Custom scroll animations initialized.");
    }

    /**
     * Sets up the theme toggling functionality.
     * Handles localStorage persistence and system preference detection.
     */
    function initThemeToggle() {
        const themeToggleId = "theme-toggle";
        const themeStyleId = "theme-styles";
        const darkThemeClass = "dark-theme";
        const themeLocalStorageKey = "theme";

        // Check system preference
        const prefersDarkScheme = win.matchMedia("(prefers-color-scheme: dark)");

        // Determine the initial theme
        const getInitialTheme = () => {
            const savedTheme = localStorage.getItem(themeLocalStorageKey);
            if (savedTheme) {
                return savedTheme;
            }
            return prefersDarkScheme.matches ? "dark" : "light";
        };

        let currentTheme = getInitialTheme();

        // Apply the initial theme to the body
        if (currentTheme === "dark") {
            body.classList.add(darkThemeClass);
        }

        // Function to create and append theme CSS variables
        const ensureThemeStyles = () => {
            if (!doc.getElementById(themeStyleId)) {
                const css = doc.createElement("style");
                css.id = themeStyleId;
                // CSS variables for light and dark themes
                css.textContent = `
                    :root {
                        --bg-color: #ffffff;
                        --text-color: #222222;
                        --primary-color: #4fd1c5; /* Teal-like color */
                        --secondary-color: #2c7a7b; /* Darker teal */
                        --accent-color: #81e6d9; /* Lighter teal */
                        --card-bg: rgba(0, 0, 0, 0.03);
                        --link-color: #2b6cb0; /* Blue for links */
                        --link-hover-color: #2c5282; /* Darker blue */

                        /* Social icon colors */
                        --linkedin-color: #0077b5;
                        --github-color: #333333;
                        --twitter-color: #1da1f2;
                        --dev-color: #333333;

                        /* Code block styling */
                        --code-bg: #f8f9fa;
                        --code-border: var(--primary-color);
                        --code-text: #212529;
                        --code-keyword: #d73a49; /* Red */
                        --code-string: #032f62; /* Dark Blue */
                        --code-method: #6f42c1; /* Purple */
                        --code-symbol: #e36209; /* Orange */
                        --code-comment: #6a737d; /* Grey */

                        --toggle-bg: #ffffff;
                        --toggle-icon: #222222;
                        --toggle-shadow: rgba(0,0,0,0.2);
                    }

                    body.${darkThemeClass} {
                        --bg-color: #1a202c; /* Dark blue-grey */
                        --text-color: #e2e8f0; /* Light grey */
                        --primary-color: #4fd1c5; /* Teal (same as light) */
                        --secondary-color: #81e6d9; /* Lighter teal */
                        --accent-color: #2c7a7b; /* Darker teal */
                        --card-bg: rgba(255, 255, 255, 0.05);
                        --link-color: #63b3ed; /* Light blue */
                        --link-hover-color: #90cdf4; /* Lighter blue */

                        /* Social icon colors */
                        --linkedin-color: #0077b5; /* Keep same */
                        --github-color: #f5f5f5; /* Light grey */
                        --twitter-color: #1da1f2; /* Keep same */
                        --dev-color: #f5f5f5; /* Light grey */

                         /* Code block styling */
                        --code-bg: #2d3748; /* Darker background */
                        --code-border: var(--primary-color);
                        --code-text: #e2e8f0;
                        --code-keyword: #f97583; /* Light Red */
                        --code-string: #79c0ff; /* Light Blue */
                        --code-method: #d2a8ff; /* Light Purple */
                        --code-symbol: #ffab70; /* Light Orange */
                        --code-comment: #8b949e; /* Lighter Grey */

                        --toggle-bg: #2d3748; /* Dark grey */
                        --toggle-icon: #e2e8f0; /* Light grey */
                        --toggle-shadow: rgba(255,255,255,0.1);
                    }

                    /* General body transition */
                    body {
                        background-color: var(--bg-color);
                        color: var(--text-color);
                        transition: background-color 0.3s ease, color 0.3s ease;
                    }

                    /* Apply link colors */
                    a {
                        color: var(--link-color);
                        text-decoration: none; /* Optional: remove underline */
                        transition: color 0.2s ease;
                    }
                    a:hover {
                        color: var(--link-hover-color);
                        text-decoration: underline; /* Optional: add underline on hover */
                    }

                    /* Social icon colors using variables */
                    .social-icon.linkedin { color: var(--linkedin-color) !important; }
                    .social-icon.github { color: var(--github-color) !important; }
                    .social-icon.twitter { color: var(--twitter-color) !important; }
                    .social-icon.dev { color: var(--dev-color) !important; }

                    /* Code block base styling */
                    .code-block {
                        background: var(--code-bg);
                        border-left: 4px solid var(--code-border);
                        color: var(--code-text);
                        padding: 1em;
                        margin: 1em 0;
                        overflow-x: auto;
                        border-radius: 4px; /* Optional: rounded corners */
                        font-family: monospace;
                        font-size: 0.9em;
                        transition: background-color 0.3s ease, border-color 0.3s ease;
                    }
                    /* Code syntax highlighting classes */
                    .code-block .keyword { color: var(--code-keyword); font-weight: bold; }
                    .code-block .string { color: var(--code-string); }
                    .code-block .method { color: var(--code-method); }
                    .code-block .symbol { color: var(--code-symbol); }
                    .code-block .comment { color: var(--code-comment); font-style: italic; }


                    /* Theme toggle button styling */
                    #${themeToggleId} {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        z-index: 1000;
                        padding: 10px;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        background-color: var(--toggle-bg);
                        color: var(--toggle-icon);
                        box-shadow: 0 2px 5px var(--toggle-shadow);
                        transition: transform 0.2s ease, background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease;
                        display: flex; /* Center icon */
                        align-items: center;
                        justify-content: center;
                    }
                    #${themeToggleId}:hover {
                        transform: scale(1.1);
                    }
                    #${themeToggleId} .theme-icon {
                        width: 20px;
                        height: 20px;
                        display: block;
                    }
                `;
                head.appendChild(css);
                console.log("Theme CSS variables injected.");
            }
        };

        // Function to create or get the theme toggle button
        const getOrCreateThemeToggle = () => {
            let button = doc.getElementById(themeToggleId);
            if (!button) {
                button = doc.createElement("button");
                button.id = themeToggleId;
                body.appendChild(button);
                console.log("Theme toggle button created.");
            }
            return button;
        };

        // Function to update the toggle button icon and title
        const updateToggleIcon = (button, theme) => {
            const sunIcon = `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
            const moonIcon = `<svg class="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 A7 7 0 0 0 21 12.79z"></path></svg>`;

            if (theme === "dark") {
                button.innerHTML = sunIcon; // Show sun icon for dark mode
                button.title = "Switch to light mode";
            } else {
                button.innerHTML = moonIcon; // Show moon icon for light mode
                button.title = "Switch to dark mode";
            }
        };

        // Function to update Particles.js colors based on the current theme
        const updateParticlesTheme = () => {
            // Check if particlesJS instance exists
            if (win.pJSDom && win.pJSDom[0] && win.pJSDom[0].pJS) {
                const particlesInstance = win.pJSDom[0].pJS;
                // Get the primary color from the *currently applied* CSS variables
                const newPrimaryColor = getComputedStyle(docEl).getPropertyValue('--primary-color').trim();

                if (newPrimaryColor) {
                    particlesInstance.particles.color.value = newPrimaryColor;
                    particlesInstance.particles.line_linked.color = newPrimaryColor;
                    // Refresh particles to apply changes
                    particlesInstance.fn.particlesRefresh();
                    console.log(`Particles color updated to: ${newPrimaryColor}`);
                }
            } else {
                console.warn("Could not find particles.js instance to update theme.");
            }
        };

        // --- Setup Execution ---

        // 1. Ensure CSS variables are available
        ensureThemeStyles();

        // 2. Get or create the toggle button
        const themeToggle = getOrCreateThemeToggle();

        // 3. Set the initial icon
        updateToggleIcon(themeToggle, currentTheme);

        // 4. Add click listener for toggling
        themeToggle.addEventListener("click", () => {
            body.classList.toggle(darkThemeClass);

            // Update current theme state and save to localStorage
            currentTheme = body.classList.contains(darkThemeClass) ? "dark" : "light";
            localStorage.setItem(themeLocalStorageKey, currentTheme);

            // Update button icon
            updateToggleIcon(themeToggle, currentTheme);

            // Update particles color (needs a slight delay for CSS vars to update)
            setTimeout(updateParticlesTheme, 50); // 50ms delay seems sufficient

            console.log(`Theme switched to: ${currentTheme}`);
        });

        // 5. Listen for system preference changes
        prefersDarkScheme.addEventListener("change", (e) => {
            // Only change if the user hasn't manually set a theme via the toggle
            if (!localStorage.getItem(themeLocalStorageKey)) {
                const newSystemTheme = e.matches ? "dark" : "light";
                body.classList.toggle(darkThemeClass, e.matches); // Set class based on match
                currentTheme = newSystemTheme;
                updateToggleIcon(themeToggle, currentTheme);
                // Update particles color
                 setTimeout(updateParticlesTheme, 50);
                console.log(`System theme preference changed to: ${currentTheme}`);
            }
        });

        console.log("Theme toggle initialized.");
    }

    // --- Initialize all modules ---
    initAOS();
    initTyped();
    initParticles();
    initSmoothScroll();
    initScrollAnimations(); // Initialize custom animations for non-AOS elements
    initThemeToggle();

    // Ensure footer is always visible on page load and full scroll
    const footer = doc.querySelector('footer');
    if (footer) {
        // Show footer when page is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                footer.style.opacity = "1";
                footer.style.transform = "translateY(0)";
                footer.style.transition = "opacity 0.8s ease-out, transform 0.8s cubic-bezier(0.17, 0.67, 0.43, 0.99)";
            }, 500); // Short delay to ensure everything else is loaded
        });

        // Show footer when user scrolls to bottom of the page
        window.addEventListener('scroll', () => {
            // Check if we're near the bottom of the page
            const scrolledToBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100;
            if (scrolledToBottom) {
                footer.style.opacity = "1";
                footer.style.transform = "translateY(0)";
            }
        }, { passive: true });
    }

    console.log("All initializations complete.");
});
