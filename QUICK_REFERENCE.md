# 🎨 Quick Reference - CSS Classes & Features

## New CSS Classes Added

### Page Loader
```html
<div class="page-loader">
    <div class="loader-content">
        <div class="loader-spinner"></div>
        <div class="loader-text">LOADING</div>
    </div>
</div>
```

### Scroll Progress Bar
```html
<div class="scroll-progress"></div>
```

## CSS Variables Reference

### Colors
```css
--bg-color: #0a0e27
--text-color: #ffffff
--accent-color: #4fd1c5
--secondary-color: #e53e3e
--tertiary-color: #f6e05e
--card-bg: rgba(255, 255, 255, 0.05)
--primary-color-rgb: 79, 209, 197
```

### Gradients
```css
--gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
--gradient-2: linear-gradient(135deg, #4fd1c5 0%, #3498db 100%)
```

### Shadows
```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.1)
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.2)
--shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.3)
```

### Transitions
```css
--transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1)
```

## JavaScript Functions Added

### initPageLoader()
- Creates and shows page loader
- Auto-hides when page fully loads
- Smooth fade-out animation

### initScrollProgress()
- Creates scroll progress bar
- Updates on scroll with RAF
- Performance optimized

## Hover Effects

### Skills (.skill:hover)
- Transform: `translateY(-8px) scale(1.05)`
- Glow shadow with accent color
- Gradient reveal animation

### Social Links (.social-link:hover)
- Transform: `translateY(-5px) scale(1.05)`
- Gradient slide-in effect
- Enhanced shadow

### Approach Blocks (.approach-block:hover)
- Transform: `translateY(-10px) scale(1.02)`
- Radial gradient reveal
- Icon rotation and glow

## Animations Reference

### @keyframes Available
```css
fadeInUp      - Fade in from bottom
bounce        - Bouncing animation
badge-shine   - Shine sweep effect
spin          - Rotation (loader)
fadeIn        - Simple fade in
pulse-glow    - Pulsing glow effect
float         - Floating up/down
```

## Performance Tips

### Use These Properties for Best Performance
```css
transform: translateY() scale()  /* GPU accelerated */
opacity: 0-1                     /* GPU accelerated */
will-change: transform           /* Hint to browser */
backface-visibility: hidden      /* Reduce flicker */
```

### Avoid These in Animations
```css
width, height    /* Triggers reflow */
margin, padding  /* Triggers reflow */
top, left        /* Use transform instead */
```

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1400px) { }
```

## Accessibility Features

### Focus States
- All interactive elements have visible focus
- 3px outline with accent color
- 3px offset for clarity

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
    /* Minimal animations */
}
```

### High Contrast
```css
@media (prefers-contrast: high) {
    /* Enhanced borders and colors */
}
```

## Custom Scrollbar

```css
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--bg-color); }
::-webkit-scrollbar-thumb { background: gradient; }
```

## Browser Support

### Full Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partial Support
- IE 11 (basic functionality, no modern effects)
- Older mobile browsers (graceful degradation)

## Testing Checklist

✅ Test on Chrome, Firefox, Safari  
✅ Test on mobile devices  
✅ Test keyboard navigation  
✅ Test with reduced motion enabled  
✅ Test with high contrast mode  
✅ Check Lighthouse scores  
✅ Verify no console errors  
✅ Test scroll performance  
✅ Verify loader appears/disappears  
✅ Check responsive breakpoints  

## Common Customizations

### Change Accent Color
```css
:root {
    --accent-color: #YOUR_COLOR;
    --primary-color-rgb: R, G, B;
}
```

### Adjust Animation Speed
```css
:root {
    --transition-base: 0.5s; /* Slower */
}
```

### Modify Particle Count
```javascript
number: { value: 40 } // Reduce for better performance
```

### Change Background Gradient
```css
body {
    background: linear-gradient(180deg, YOUR_COLORS);
}
```

## Tips for Extending

1. **Add New Sections**: Follow existing pattern with AOS attributes
2. **Custom Cards**: Use `.approach-block` as template
3. **New Colors**: Add to `:root` variables
4. **Extra Animations**: Add to bottom of CSS with `@keyframes`

---

📚 **Documentation**: See IMPROVEMENTS.md for detailed changes  
🐛 **Issues**: Check browser console for errors  
💡 **Tips**: Use DevTools to inspect and customize  
