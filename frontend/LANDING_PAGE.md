# Landing Page - Login/Signup

## Features

### 🎨 Visual Design
- **Split-screen layout** with animated left panel and clean right panel
- **Particle animation** that forms "MEET SUMMARIZER" text from dynamic particles
- **Interactive rotation** - particles rotate when hovering over the canvas
- **Mouse repulsion** - particles move away from cursor on hover
- **Gradient backgrounds** with modern purple/blue color scheme
- **Smooth animations** throughout the interface

### 🔐 Authentication Forms
- **Dynamic form switching** between Login and Signup
- **Password visibility toggle** with eye icon
- **Form validation** with error messages
- **Google OAuth integration** (ready for backend connection)
- **Responsive design** for all screen sizes

### ⚡ Technical Highlights
- Built with **React + TypeScript**
- Canvas-based particle system with physics simulation
- Real-time rotation matrix calculations for smooth rotation
- Optimized animation loop using `requestAnimationFrame`
- Modern CSS with gradients, shadows, and micro-animations

## Components

### `LandingPage.tsx`
Main landing page component that orchestrates the layout

### `ParticleText.tsx`
Advanced particle animation:
- Text sampling from canvas
- Physics-based particle movement
- Rotation on hover
- Mouse interaction
- Connecting lines between nearby particles

### `AuthForm.tsx`
Complete authentication form with:
- Email/password validation
- Password confirmation (signup mode)
- Toggle between login/signup
- Social authentication UI

### `LandingPage.css`
Comprehensive styling with:
- Modern gradients
- Smooth transitions
- Responsive breakpoints
- Micro-animations

## Usage

The landing page is set as the root route (`/`) in the application. After successful authentication, users should be redirected to `/dashboard`.

To integrate with backend:
1. Update `handleSubmit` in `AuthForm.tsx` to call your authentication API
2. Handle successful login/signup with redirect to dashboard
3. Implement token storage and authentication state management

## Customization

### Colors
Edit the gradient colors in `LandingPage.css`:
- `--primary-gradient`: Main purple gradient
- Particle colors in `ParticleText.tsx` (HSL values)

### Text
Change "MEET SUMMARIZER" text in `ParticleText.tsx`:
```typescript
const text1 = 'YOUR';
const text2 = 'BRAND NAME';
```

### Animation Speed
Adjust rotation speed and particle physics in `ParticleText.tsx`:
- `rotationAngle.current += 0.02` - rotation speed
- `force` and damping values - particle movement

## Browser Compatibility
- Modern browsers with Canvas API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Requires JavaScript enabled
