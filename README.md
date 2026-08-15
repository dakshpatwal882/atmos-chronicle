# Atmos Chronicle

Build a premium, cinematic weather forecasting website with a strong focus on visual storytelling, immersive animations, 4D/3D depth, and a vintage-aesthetic color palette.

Core Concept

Create a weather website that feels like a combination of:

A vintage scientific weather station

A cinematic weather visualization

A futuristic 4D weather interface

An aesthetic editorial website

The website should feel alive, not like a static weather dashboard.

The visual experience is the highest priority.

1. Overall Visual Style

Use a vintage + futuristic aesthetic.

Color palette

Use muted, sophisticated colors rather than bright modern SaaS colors:

Warm cream / parchment

Faded beige

Vintage brown

Dark charcoal

Muted olive

Dusty blue

Desaturated orange

Faded amber

Use subtle gradients, film grain, paper textures, glass effects, and soft shadows.

Avoid:

Neon colors

Generic blue weather-app styling

Excessive white backgrounds

Generic cards everywhere

Corporate SaaS appearance

The website should look like an old weather atlas brought to life with futuristic technology.

2. Hero Section

Create a massive immersive hero section occupying most of the first viewport.

Show:

Location

New Delhi, India

Current temperature

28°C

Weather

Partly Cloudy

Also show:

Feels like

Humidity

Wind speed

Visibility

UV index

Air pressure

But keep the information visually elegant and minimal.

Main visual

Use a large cinematic weather image/video-like background representing the current weather.

For example:

Sunny → golden sunlight / vintage summer landscape

Rain → cinematic rainy street

Cloudy → dramatic cloudy sky

Storm → dark clouds and lightning

Snow → atmospheric snowy landscape

Fog → misty forest/city

Apply a subtle vintage film treatment.

3. Interactive "4D" Weather Effect

Create a 4D-style interactive weather visualization in the hero.

This does NOT need to be technically true 4D.

Create the illusion of depth using:

Parallax

Layered clouds

Floating particles

Depth-of-field

Mouse movement

Perspective transforms

Atmospheric particles

Light movement

Subtle 3D objects

Dynamic shadows

The entire hero should react smoothly to the user's cursor.

Cursor interaction

When the user moves their cursor:

Background should subtly move in the opposite direction

Clouds should move at different speeds depending on depth

Particles should react to cursor position

Lighting should slightly shift

Weather elements should have depth

Text can have a very subtle parallax effect

Make the effect smooth and premium.

Do NOT make the interaction exaggerated or gimmicky.

4. Interactive Background Image

The background should be divided conceptually into interactive regions.

When the cursor moves over a particular part of the image:

Example

Hover over the sky:

→ Clouds react/move
→ Sky slightly changes color
→ Small atmospheric particles appear

Hover over the sun:

→ Warm light expands
→ Lens flare appears
→ Background becomes slightly warmer

Hover over rain:

→ Rain intensity increases
→ Ripple effects appear
→ Soundless cinematic visual response

Hover over clouds:

→ Clouds move apart
→ Light rays appear

Hover over mountains/buildings:

→ Perspective/depth effect increases

The user should feel like they are interacting with the weather itself.

Use smooth transitions around 300–800ms.

5. Dynamic Weather Background

The background should automatically adapt to the selected weather condition.

Create visual states for:

☀️ Clear
🌤️ Partly Cloudy
☁️ Cloudy
🌧️ Rain
⛈️ Thunderstorm
❄️ Snow
🌫️ Fog
🌙 Night

Each state should have:

Different atmospheric lighting

Different particles

Different animation

Different background imagery

Different subtle color grading

The transition between weather states should be cinematic.

Example:

Rain → Clear

Rain particles slowly disappear → clouds move → sunlight enters → colors become warmer.

6. Search Bar

Create a beautiful minimal weather search interface.

Placeholder:

"Search city, country..."

When searching:

Autocomplete locations

Show country

Show city

Show coordinates if useful

Use a floating glass/vintage input.

Add a subtle magnifying-glass animation.

7. Current Weather Section

Below the hero, create an elegant weather information section.

Display:

Temperature

28°C

Conditions

Partly Cloudy

Details

Humidity: 62%
Wind: 14 km/h
Pressure: 1012 hPa
Visibility: 8 km
UV Index: 5

Use typography inspired by vintage scientific instruments/weather reports.

8. 7-Day Forecast

Create a horizontal cinematic forecast timeline.

Instead of boring rectangular cards, make it feel like a weather timeline.

Example:

MON → TUE → WED → THU → FRI → SAT → SUN

Each day displays:

Weather icon/animation

High temperature

Low temperature

Precipitation probability

When hovering over a day:

Day expands slightly

Weather visualization changes

Background atmosphere reacts

More information appears

Use smooth spring animations.

9. Hourly Forecast

Create an interactive horizontal timeline.

Show:

12 AM → 3 AM → 6 AM → 9 AM → 12 PM → 3 PM → 6 PM → 9 PM

Display:

Temperature

Weather

Precipitation

Wind

Add a smooth temperature curve.

Allow the user to drag across the timeline.

As they move:

Temperature updates

Weather visualization changes

Background lighting changes based on time

Sunrise/sunset colors transition naturally

10. Weather Visualization

Create an elegant animated visualization area.

Include:

Temperature graph

Smooth curved graph with animated line drawing.

Precipitation

Animated rainfall probability visualization.

Wind

Animated flowing particles showing wind direction.

Humidity

Circular or atmospheric visualization.

Avoid generic dashboard charts.

Make the graphs feel integrated into the cinematic design.

11. Sunrise / Sunset

Create a beautiful horizontal sun-cycle visualization.

Show:

🌅 Sunrise
☀️ Day
🌇 Sunset
🌙 Night

Animate a small sun moving across the horizon.

Use gradients inspired by real atmospheric colors.

12. Moon Phase

Create a realistic-looking animated moon.

Show:

Current moon phase

Illumination percentage

Moonrise

Moonset

Use subtle 3D rotation and lighting.

13. Weather Radar / Map

Add a weather map section.

Use a dark vintage map aesthetic.

Show:

Rain

Clouds

Temperature

Wind

The map should have a slightly old-cartography appearance mixed with modern visualization.

Add animated radar sweeps.

14. Microinteractions

Use animations throughout the website.

Examples:

Buttons have subtle magnetic hover effects

Cards gently lift on hover

Weather icons animate

Temperature numbers smoothly count/change

Clouds slowly move

Background particles react to cursor

Page sections reveal themselves while scrolling

Graphs animate when entering viewport

Forecast timeline smoothly scrolls

Cursor interaction creates subtle atmospheric effects

Keep everything elegant.

No excessive bouncing or flashy animations.

15. Typography

Use a combination of:

Display font

Elegant serif / editorial / vintage style.

Body font

Clean modern sans-serif.

The typography should create a contrast between:

Old-world weather journal + modern technology

Use large cinematic typography for temperatures.

Example:

28°

Make the temperature visually dominant.

16. Navigation

Create a minimal transparent navigation bar.

Left:

ATMOS

or another elegant weather brand name.

Center/right:

Forecast

Map

Radar

About

Right:

°C / °F toggle

Theme toggle

Navigation should blend into the background.

On scroll, it should become slightly blurred/glass-like.

17. Theme

Default theme:

Vintage Daylight

Also support:

Vintage Night

Dark charcoal / deep navy / muted amber.

The transition between day and night should be animated.

18. Loading Animation

Create a cinematic weather loading screen.

Example:

A small rotating atmospheric globe / weather symbol.

Text:

"Reading the atmosphere..."

Then transition smoothly into the website.

Keep loading short.

19. Responsive Design

The website must work beautifully on:

Desktop

Laptop

Tablet

Mobile

On mobile:

Replace cursor-based effects with touch/parallax interactions

Simplify background layers

Maintain cinematic visuals

Make forecast timelines horizontally scrollable

Keep typography readable

Ensure animations do not hurt performance

20. Performance

Despite the visual effects, maintain excellent performance.

Use:

CSS transforms

GPU-friendly animations

Lazy-loaded images

Optimized assets

RequestAnimationFrame where appropriate

Reduced animation complexity on mobile

Respect:

prefers-reduced-motion

If the user prefers reduced motion, significantly reduce animations.

21. Weather API Architecture

Build the application so the weather data can easily be connected to a real weather API.

Create a clean service layer for:

Current weather

Hourly forecast

Daily forecast

Air quality

Sunrise/sunset

Weather alerts

For development, provide realistic mock data if an API key is not available.

Do NOT hardcode the UI to only one city.

22. Important UX Requirement

The website should feel like an experience first and a weather dashboard second.

The first reaction should be:

"Whoa, this actually feels like weather."

Not:

"This is another weather app."

Prioritize:

Atmosphere → Interaction → Animation → Visual hierarchy → Data

rather than filling the screen with information.

23. Visual Quality Bar

Take inspiration from:

Cinematic weather documentaries

Vintage weather maps

Editorial magazine design

Analog scientific instruments

Luxury watch interfaces

Modern interactive Awwwards-style websites

Futuristic HUD interfaces

But DO NOT directly copy any existing website.

Create an original visual identity.

24. Final Experience

The final website should feel like:

"A vintage weather observatory from the future."

It should combine:

Vintage aesthetics

Cinematic photography
+ 3D/4D depth

Interactive weather

Smooth motion

Real weather data

Premium typography

Atmospheric soundless visual effects

Make the result feel expensive, artistic, immersive, and technically impressive.

Avoid generic AI-generated website patterns.

Do not use excessive cards, gradients, emojis, or unnecessary UI elements.

The design should look intentionally crafted by a world-class creative developer.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://atmos-chronicle.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/898141f5-7ca2-4ff2-8189-c57324533a4f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
