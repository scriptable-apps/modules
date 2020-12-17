const _calculatePath = (ctx, series, fillPath, options) => {
    let maxValue = (options.maxValue !== undefined) ? options.maxValue : Math.max(...series);
    let minValue = (options.minValue !== undefined) ? options.minValue : Math.min(...series);
    let difference = maxValue - minValue;
    let count = series.length;
    let step = ctx.size.width / (count - 1);
    let points = series.map((current, index, all) => {
        let x = step * index;
        let y = ctx.size.height - (current - minValue) / difference * ctx.size.height;
        return new Point(x, y);
    });
    return _getSmoothPath(ctx, points, fillPath);
}

const _getSmoothPath = (ctx, points, fillPath) => {
    let path = new Path();
    path.move(new Point(0, ctx.size.height));
    path.addLine(points[0]);
    for (let i = 0; i < points.length - 1; i++) {
      let xAvg = (points[i].x + points[i + 1].x) / 2;
      let yAvg = (points[i].y + points[i + 1].y) / 2;
      let avg = new Point(xAvg, yAvg);
      let cp1 = new Point((xAvg + points[i].x) / 2, points[i].y);
      let next = new Point(points[i + 1].x, points[i + 1].y);
      let cp2 = new Point((xAvg + points[i + 1].x) / 2, points[i + 1].y);
      path.addQuadCurve(avg, cp1);
      path.addQuadCurve(next, cp2);
    }
    if (fillPath) {
      path.addLine(new Point(ctx.size.width, ctx.size.height));
      path.closeSubpath();
    }
    return path;
}

class SimpleAreaChart {
    
    constructor(options) {    
        this.ctx = new DrawContext();    

        this.options = Object.assign({
            width: undefined,
            height: undefined,
            minValue: undefined,
            maxValue: undefined,
            opaque: false,
            fillColor: '#880000',
            fillOpaque: undefined
        }, options)

        if (!this.options.width || !this.options.height) {
            throw new Error('SimpleAreaChart: (width / height) is requried options')
        } else {
            this.ctx.size = new Size(this.options.width, this.options.height)
        }
    
        this.ctx.opaque = this.options.opaque;
        this.ctx.setFillColor(new Color(this.options.fillColor, this.options.fillOpaque));
    }
    
    render (series) {
        let path = _calculatePath(this.ctx, series, true, this.options);
        this.ctx.addPath(path);
        this.ctx.fillPath(path);
    }
    
    toImage () {
        return this.ctx.getImage()
    }
}

module.exports.SimpleAreaChart = SimpleAreaChart
