import React, {Component, PropTypes} from 'react';
import  { View  } from 'react-native';
import { Surface, Shape, Path, Group } from '../../react-native/Libraries/ART/ReactNativeART';
import MetricsPath from 'art/metrics/path';


export default class CircularProgress extends React.Component {

  circlePath(cx, cy, r, degree) {

    return Path()
      .moveTo(cx, cx)
      .move(-1*Math.sin(degree/360*2*Math.PI)*r, Math.cos(degree/360*2*Math.PI)*r)
      .arc(2*Math.sin(degree/360*2*Math.PI)*r, -2*Math.cos(degree/360*2*Math.PI)*r, r, r)
      .arc(0, 2*Math.cos(degree/360*2*Math.PI)*r, r, r);

      // .move(-1*Math.sqrt(2)/2*r, 1*Math.sqrt(2)/2*r)
      // .arc(Math.sqrt(2)*r, -1*Math.sqrt(2)*r, r, r)
      // .arc(0, Math.sqrt(2)*r, r, r);
  }

  extractFill(fill) {
    if (fill < 0.01) {
      return 0;
    } else if (fill > 100) {
      return 100;
    }

    return fill;
  }

  render() {
    const { size, width, tintColor, backgroundColor, style, rotation, missingDegree, children } = this.props;

    const circlePath = this.circlePath(size / 2, size / 2, size / 2 - width / 2, missingDegree/2);
    const fill = this.extractFill(this.props.fill);

    var circle2 = null;
    if (fill > 0) {
      circle2 = <Shape d={circlePath}
              stroke={tintColor}
              strokeCap="butt"
              strokeDash={[(size - width) * Math.PI * fill*(1-missingDegree/360) / 100, 700]}
              strokeWidth={width} />;
    }

    return (
      <View style={style}>
        <Surface
          width={size}
          height={size}>
          <Group rotation={rotation - 90} originX={size/2} originY={size/2}>
            <Shape d={circlePath}
              stroke={backgroundColor}
              strokeCap="butt"
              strokeDash={[(size - width) * Math.PI*(1-missingDegree/360), 700]}
              strokeWidth={width} />
            {circle2}
          </Group>
        </Surface>
        {
          children && children(fill)
        }
      </View>
    )
  }
}

CircularProgress.propTypes = {
  style: PropTypes.object,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  tintColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  children: PropTypes.func
}

CircularProgress.defaultProps = {
  tintColor: 'black',
  backgroundColor: '#e4e4e4',
  rotation: 90
}
