# Rain Effect Addon

A beautiful, customizable rain effect addon for [MyWallpaper](https://github.com/your-username/MyWallpaper). Features realistic raindrops with parallax depth, splash effects, atmospheric mist, and extensive customization options.

![Rain Effect Preview](preview.gif)

## Features

- **Realistic Rain Simulation** - Smooth Canvas 2D rendering with depth layers for parallax effect
- **Splash Effects** - Particles and ripples when drops hit the ground
- **Atmospheric Mist** - Optional fog/mist layer for ambiance
- **Glow Effects** - Soft glow around raindrops for a dreamy look
- **Motion Blur** - Trailing effect for fast-moving drops
- **Highly Customizable** - 20+ settings to fine-tune every aspect
- **Performance Optimized** - Efficient rendering with frame limiting
- **Hot Reload** - See changes instantly without restarting

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
| Enable Mist | Add atmospheric mist layer | On |
| Mist Density | Thickness of mist (0-0.5) | 0.15 |

### Background

| Setting | Description | Default |
|---------|-------------|---------|
| Background Color | Base background color | `#0a0a1a` |
| Background Opacity | Transparency (0 = transparent) | 0.85 |
| Enable Gradient | Use gradient background | On |
| Gradient Top | Top color of gradient | `#1a1a2e` |
| Gradient Bottom | Bottom color of gradient | `#0f0f1a` |

### Advanced

| Setting | Description | Default |
|---------|-------------|---------|
| Depth Layers | Parallax depth layers (1-5) | 3 |
| Motion Blur | Trail effect intensity (0-1) | 0.4 |

## Development

### Local Testing

1. Start a local server in the addon directory:
   ```bash
   npx serve .
   ```

2. In MyWallpaper, go to **Settings > Developer**
3. Enter `http://localhost:3000` (or your server URL)
4. Toggle **Enable Developer Mode**

### Project Structure

```
rain-effect-addon/
├── manifest.json    # Addon metadata and settings configuration
├── index.html       # Main addon code (Canvas 2D rendering)
└── README.md        # This file
```

## Technical Details

- **Rendering**: Canvas 2D API with composite operations
- **Animation**: requestAnimationFrame for smooth 60fps
- **Parallax**: Multiple depth layers with varying speed/size
- **Memory**: Efficient object pooling for drops and splashes

## Performance Tips

- Lower **Rain Intensity** for better performance on older hardware
- Reduce **Depth Layers** to decrease CPU usage
- Disable **Splash Effect** if experiencing lag
- Lower **Glow Intensity** or disable glow for faster rendering

## License

MIT License - Feel free to use, modify, and distribute.

## Credits

Created for the MyWallpaper Addon SDK v2.13.0
