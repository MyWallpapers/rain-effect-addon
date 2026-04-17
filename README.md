# Rain Effect Addon

A beautiful, customizable rain effect addon for [MyWallpaper](https://github.com/MyWallpapers/MyWallpaper). Features realistic raindrops with parallax depth, splash effects, and extensive customization options.

## Features

- **Realistic Rain Simulation** - Smooth Canvas 2D rendering at 60fps
- **Parallax Depth** - Multiple layers for 3D depth effect
- **Splash Effects** - Particles and ripples when drops hit the ground
- **Glow Effects** - Soft glow around raindrops
- **Wind System** - Adjustable angle with natural variation
- **Fully Transparent** - Overlays perfectly on any wallpaper
- **Hot Reload** - See changes instantly

## Installation

1. Download the addon files (`manifest.json` and `index.html`)
2. Open MyWallpaper and go to **Settings > Addons**
3. Click **Install from folder** and select the addon directory
4. Enable the addon on your desktop

## Settings

### Rain Settings

| Setting | Description | Default |
|---------|-------------|---------|
| Rain Color | Color of the raindrops | `#a8c8e8` |
| Rain Intensity | Number of raindrops (100-2000) | 800 |
| Fall Speed | How fast the rain falls (0.5-3x) | 1.2 |
| Drop Length | Length of rain streaks (5-50px) | 20 |
| Drop Width | Thickness of raindrops (0.5-4px) | 1.5 |

### Wind & Direction

| Setting | Description | Default |
|---------|-------------|---------|
| Wind Angle | Angle of rain (-45 to 45 degrees) | 10 |
| Wind Variation | Random variation in wind direction | 5 |

### Visual Effects

| Setting | Description | Default |
|---------|-------------|---------|
| Enable Splash | Show splash when drops hit ground | On |
| Splash Intensity | Size and visibility of splashes | 1.0 |
| Enable Glow | Add soft glow to raindrops | On |
| Glow Intensity | Brightness of glow effect | 0.3 |

### Advanced

| Setting | Description | Default |
|---------|-------------|---------|
| Depth Layers | Parallax depth layers (1-5) | 3 |

## Performance Tips

- Lower **Rain Intensity** for better performance on older hardware
- Reduce **Depth Layers** to decrease CPU usage
- Disable **Splash Effect** or **Glow** if experiencing lag

## License

MIT License

## Credits

Created for the MyWallpaper Addon SDK v2.13.0
