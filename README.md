# react-native-arc-progress

React Native component for creating animated, arc progress with ReactART. Useful for displaying users points for example.

## ChangLog

1. fix weird diplay when fill is less that 0.01;

## Example app
![image](http://ww3.sinaimg.cn/mw690/5a7b1062gw1f0cyub8h0cj20cy0dadij.jpg)

## Installation

1. Install library `npm i --save react-native-arc-progress`
2. Link ART library to your ReactNative project ([how to link a library?](https://facebook.github.io/react-native/docs/linking-libraries-ios.html#content)). You'll find ReactART library in `node_modules/react-native/Libraries/ART/ART.xcodeproj`

## Usage

Import ArcProgress or AnimatedArcProgress.

```js
import { AnimatedArcProgress } from 'react-native-arc-progress';
```

Use as follows:

```jsx
<AnimatedArcProgress
  size={120}
  width={15}
  fill={100}
  missingDegree={90}
  tintColor="#00e0ff"
  backgroundColor="#3d5875" />
```

You can also define a function, that'll receive current progress and for example display it inside the circle:

```jsx
<AnimatedArcProgress
  size={200}
  width={3}
  fill={this.state.fill}
  tintColor="#00e0ff"
  missingDegree={90}
  backgroundColor="#3d5875">
  {
    (fill) => (
      <Text style={styles.points}>
        { this.state.fill }
      </Text>
    )
  }
</AnimatedArcProgress>
```

## Configuration

You can configure the passing by following props:

- **size** – width and height of the circle
- **width** - thickness of the line
- **fill** - current, percentage fill (from 0 to 100)
- **prefill** - percentage fill before the animation (from 0 to 100)
- **missingDegree** - missing part of arc, unit is degree (0-360)
- **tintColor** - color of a progress line
- **backgroundColor** - color of a background for progress line
- **rotation** - by default, progress starts from the angle = 90⦝, you can change it by setting value from -360 to 360
- **children(fill)** - you can pass function as a child to receive current fill



## Special thanks
Special thanks to [Chalk+Chisel](http://chalkchisel.com) for creating working environment where people grow. This component was created for one of the projects we're working on.
